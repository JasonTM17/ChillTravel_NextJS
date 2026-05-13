import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReviewService } from './review.service';

// ---------------------------------------------------------------------------
// Mock factories
// ---------------------------------------------------------------------------

function makePrisma() {
  return {
    tour: { findUnique: vi.fn() },
    booking: { findFirst: vi.fn() },
    review: {
      findUnique: vi.fn(),
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn().mockResolvedValue({}),
    },
    auditLog: { create: vi.fn().mockResolvedValue({}) },
  };
}

function makeAudit() {
  return { log: vi.fn().mockResolvedValue(undefined) };
}

// ---------------------------------------------------------------------------
// Shared test data
// ---------------------------------------------------------------------------

const MOCK_TOUR = {
  id: 'tour-id-1',
  title: 'Test Tour',
  slug: 'test-tour',
  status: 'ACTIVE',
};

const MOCK_REVIEW = {
  id: 'review-id-1',
  userId: 'user-id-1',
  tourId: 'tour-id-1',
  rating: 5,
  title: 'Great tour',
  content: 'This was an amazing experience!',
  status: 'PENDING',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const MOCK_COMPLETED_BOOKING = {
  id: 'booking-id-1',
  userId: 'user-id-1',
  tourId: 'tour-id-1',
  status: 'completed',
};

const CREATE_DTO = {
  rating: 5,
  title: 'Great tour',
  content: 'This was an amazing experience!',
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ReviewService', () => {
  let service: ReviewService;
  let prisma: ReturnType<typeof makePrisma>;
  let audit: ReturnType<typeof makeAudit>;

  beforeEach(() => {
    prisma = makePrisma();
    audit = makeAudit();
    service = new ReviewService(prisma as never, audit as never);
  });

  // -------------------------------------------------------------------------
  // create
  // -------------------------------------------------------------------------

  describe('create', () => {
    it('creates review with status=PENDING when user has a COMPLETED booking', async () => {
      prisma.tour.findUnique.mockResolvedValue(MOCK_TOUR);
      prisma.booking.findFirst.mockResolvedValue(MOCK_COMPLETED_BOOKING);
      prisma.review.create.mockResolvedValue({
        ...MOCK_REVIEW,
        user: { id: 'user-id-1', fullName: 'Test User', avatarUrl: null },
        tour: { id: 'tour-id-1', title: 'Test Tour', slug: 'test-tour' },
      });

      const result = await service.create('user-id-1', 'tour-id-1', CREATE_DTO);

      expect(prisma.review.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-id-1',
            tourId: 'tour-id-1',
            rating: 5,
            status: 'PENDING',
          }),
        }),
      );
      expect(result.status).toBe('PENDING');
    });

    it('throws ForbiddenException when user has no COMPLETED booking for the tour', async () => {
      prisma.tour.findUnique.mockResolvedValue(MOCK_TOUR);
      prisma.booking.findFirst.mockResolvedValue(null); // no completed booking

      await expect(service.create('user-id-1', 'tour-id-1', CREATE_DTO)).rejects.toThrow(
        ForbiddenException,
      );

      expect(prisma.review.create).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when tour does not exist', async () => {
      prisma.tour.findUnique.mockResolvedValue(null);

      await expect(service.create('user-id-1', 'nonexistent-tour', CREATE_DTO)).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.booking.findFirst).not.toHaveBeenCalled();
      expect(prisma.review.create).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when tour is DELETED', async () => {
      prisma.tour.findUnique.mockResolvedValue({ ...MOCK_TOUR, status: 'DELETED' });

      await expect(service.create('user-id-1', 'tour-id-1', CREATE_DTO)).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.review.create).not.toHaveBeenCalled();
    });

    it('passes rating through to prisma.review.create without extra validation', async () => {
      // Rating validation (1-5) is enforced by class-validator in the DTO layer.
      // The service passes the rating through as-is.
      prisma.tour.findUnique.mockResolvedValue(MOCK_TOUR);
      prisma.booking.findFirst.mockResolvedValue(MOCK_COMPLETED_BOOKING);
      prisma.review.create.mockResolvedValue({
        ...MOCK_REVIEW,
        rating: 3,
        user: { id: 'user-id-1', fullName: 'Test User', avatarUrl: null },
        tour: { id: 'tour-id-1', title: 'Test Tour', slug: 'test-tour' },
      });

      await service.create('user-id-1', 'tour-id-1', { ...CREATE_DTO, rating: 3 });

      expect(prisma.review.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ rating: 3 }),
        }),
      );
    });
  });

  // -------------------------------------------------------------------------
  // update
  // -------------------------------------------------------------------------

  describe('update', () => {
    it('updates review when called by the owner', async () => {
      prisma.review.findUnique.mockResolvedValue(MOCK_REVIEW);
      prisma.review.update.mockResolvedValue({
        ...MOCK_REVIEW,
        rating: 4,
        content: 'Updated content here.',
        user: { id: 'user-id-1', fullName: 'Test User', avatarUrl: null },
        tour: { id: 'tour-id-1', title: 'Test Tour', slug: 'test-tour' },
      });

      const result = await service.update('user-id-1', 'review-id-1', {
        rating: 4,
        content: 'Updated content here.',
      });

      expect(prisma.review.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'review-id-1' },
          data: expect.objectContaining({ rating: 4, content: 'Updated content here.' }),
        }),
      );
      expect(result.rating).toBe(4);
    });

    it('throws ForbiddenException when update is called by a non-owner', async () => {
      prisma.review.findUnique.mockResolvedValue(MOCK_REVIEW); // owned by "user-id-1"

      await expect(service.update('other-user-id', 'review-id-1', { rating: 3 })).rejects.toThrow(
        ForbiddenException,
      );

      expect(prisma.review.update).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when review does not exist', async () => {
      prisma.review.findUnique.mockResolvedValue(null);

      await expect(
        service.update('user-id-1', 'nonexistent-review', { rating: 4 }),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.review.update).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // remove
  // -------------------------------------------------------------------------

  describe('remove', () => {
    it('deletes review when called by the owner', async () => {
      prisma.review.findUnique.mockResolvedValue(MOCK_REVIEW);

      await service.remove('user-id-1', 'review-id-1');

      expect(prisma.review.delete).toHaveBeenCalledWith({
        where: { id: 'review-id-1' },
      });
    });

    it('throws ForbiddenException when remove is called by a non-owner', async () => {
      prisma.review.findUnique.mockResolvedValue(MOCK_REVIEW); // owned by "user-id-1"

      await expect(service.remove('other-user-id', 'review-id-1')).rejects.toThrow(
        ForbiddenException,
      );

      expect(prisma.review.delete).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // approve
  // -------------------------------------------------------------------------

  describe('approve', () => {
    it('sets review status to APPROVED and calls auditService.log', async () => {
      prisma.review.findUnique.mockResolvedValue(MOCK_REVIEW);
      prisma.review.update.mockResolvedValue({
        ...MOCK_REVIEW,
        status: 'APPROVED',
        user: { id: 'user-id-1', fullName: 'Test User', email: 'user@test.com' },
        tour: { id: 'tour-id-1', title: 'Test Tour', slug: 'test-tour' },
      });

      const result = await service.approve('review-id-1', 'admin-id-1');

      expect(prisma.review.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'review-id-1' },
          data: { status: 'APPROVED' },
        }),
      );
      expect(audit.log).toHaveBeenCalledWith(
        expect.objectContaining({
          actorId: 'admin-id-1',
          action: 'APPROVE_REVIEW',
          resourceType: 'Review',
          resourceId: 'review-id-1',
        }),
      );
      expect(result.status).toBe('APPROVED');
    });

    it('throws NotFoundException when review does not exist', async () => {
      prisma.review.findUnique.mockResolvedValue(null);

      await expect(service.approve('nonexistent-review', 'admin-id-1')).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.review.update).not.toHaveBeenCalled();
      expect(audit.log).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // reject
  // -------------------------------------------------------------------------

  describe('reject', () => {
    it('sets review status to REJECTED and calls auditService.log', async () => {
      prisma.review.findUnique.mockResolvedValue(MOCK_REVIEW);
      prisma.review.update.mockResolvedValue({
        ...MOCK_REVIEW,
        status: 'REJECTED',
        user: { id: 'user-id-1', fullName: 'Test User', email: 'user@test.com' },
        tour: { id: 'tour-id-1', title: 'Test Tour', slug: 'test-tour' },
      });

      const result = await service.reject('review-id-1', 'admin-id-1');

      expect(prisma.review.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'review-id-1' },
          data: { status: 'REJECTED' },
        }),
      );
      expect(audit.log).toHaveBeenCalledWith(
        expect.objectContaining({
          actorId: 'admin-id-1',
          action: 'REJECT_REVIEW',
          resourceType: 'Review',
          resourceId: 'review-id-1',
        }),
      );
      expect(result.status).toBe('REJECTED');
    });
  });

  // -------------------------------------------------------------------------
  // hide
  // -------------------------------------------------------------------------

  describe('hide', () => {
    it('sets review status to HIDDEN and calls auditService.log', async () => {
      prisma.review.findUnique.mockResolvedValue(MOCK_REVIEW);
      prisma.review.update.mockResolvedValue({
        ...MOCK_REVIEW,
        status: 'HIDDEN',
        user: { id: 'user-id-1', fullName: 'Test User', email: 'user@test.com' },
        tour: { id: 'tour-id-1', title: 'Test Tour', slug: 'test-tour' },
      });

      const result = await service.hide('review-id-1', 'admin-id-1');

      expect(prisma.review.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'review-id-1' },
          data: { status: 'HIDDEN' },
        }),
      );
      expect(audit.log).toHaveBeenCalledWith(
        expect.objectContaining({
          actorId: 'admin-id-1',
          action: 'HIDE_REVIEW',
          resourceType: 'Review',
          resourceId: 'review-id-1',
        }),
      );
      expect(result.status).toBe('HIDDEN');
    });
  });
});
