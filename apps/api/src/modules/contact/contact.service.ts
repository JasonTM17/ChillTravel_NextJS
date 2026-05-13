import { Injectable, NotFoundException } from '@nestjs/common';
import { buildPagination } from '../../common/dto/paginated-response.dto';
import type { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateContactDto } from './dto/create-contact.dto';
import type { UpdateContactStatusDto } from './dto/update-contact-status.dto';

/**
 * ContactService — business logic for contact requests.
 *
 * Handles:
 *  - submit: create a new ContactRequest with status=NEW.
 *  - adminList: paginated list with optional status filter.
 *  - updateStatus: update status, assignedTo, and/or adminNote fields.
 *
 * Req 16 / Design §3.3 Contact.
 */
@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // Public: submit a new contact request
  // ---------------------------------------------------------------------------

  async submit(dto: CreateContactDto) {
    const contact = await this.prisma.contactRequest.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone ?? null,
        destinationInterested: dto.destinationInterested ?? null,
        message: dto.message,
        status: 'NEW',
      },
    });

    return contact;
  }

  // ---------------------------------------------------------------------------
  // Admin: list all contact requests (paginated, optional status filter)
  // ---------------------------------------------------------------------------

  async adminList(query: PaginationQueryDto & { status?: string }) {
    const page = query.page ?? 0;
    const size = query.size ?? 20;
    const skip = page * size;

    const where: Record<string, unknown> = {};
    if (query.status) {
      where['status'] = query.status;
    }

    const [items, totalElements] = await Promise.all([
      this.prisma.contactRequest.findMany({
        where,
        skip,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contactRequest.count({ where }),
    ]);

    return buildPagination(items, page, size, totalElements);
  }

  // ---------------------------------------------------------------------------
  // Admin: update status / assignedTo / adminNote
  // ---------------------------------------------------------------------------

  async updateStatus(id: string, dto: UpdateContactStatusDto) {
    const existing = await this.prisma.contactRequest.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Không tìm thấy yêu cầu liên hệ');
    }

    const updated = await this.prisma.contactRequest.update({
      where: { id },
      data: {
        ...(dto.status !== undefined && {
          status: dto.status as 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED',
        }),
        ...(dto.assignedTo !== undefined && { assignedTo: dto.assignedTo }),
        ...(dto.adminNote !== undefined && { adminNote: dto.adminNote }),
      },
    });

    return updated;
  }
}
