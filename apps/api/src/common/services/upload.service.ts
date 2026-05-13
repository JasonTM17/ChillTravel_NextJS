import { mkdir, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

/**
 * Abstraction interface for upload operations.
 *
 * Allows swapping LocalUploadService for an S3/Cloudinary implementation
 * without touching the controller layer (Req 18, Design §9).
 */
export interface IUploadService {
  uploadImage(file: Express.Multer.File): Promise<{ url: string; filename: string }>;
  deleteImage(filename: string): Promise<void>;
}

/** Allowed MIME types for image uploads. */
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

/** Default max file size: 5 MB */
const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * LocalUploadService — saves uploaded images to the local filesystem.
 *
 * - Reads UPLOAD_DIR from ConfigService (default: ./uploads).
 * - Reads MAX_FILE_SIZE from ConfigService (default: 5 MB).
 * - Validates MIME type (jpg/png/webp) and file size.
 * - Generates a UUID-based filename to avoid collisions.
 * - Creates UPLOAD_DIR if it does not exist.
 * - Returns a URL in the form /uploads/{filename}.
 *
 * Req 18 / Design §9.
 */
@Injectable()
export class LocalUploadService implements IUploadService {
  private readonly logger = new Logger(LocalUploadService.name);
  private readonly uploadDir: string;
  private readonly maxFileSize: number;

  constructor(private readonly config: ConfigService) {
    const rawDir = this.config?.get<string>('UPLOAD_DIR') ?? './uploads';
    this.uploadDir = join(process.cwd(), rawDir);

    const rawMax = this.config?.get<number | string>('MAX_FILE_SIZE');
    this.maxFileSize =
      rawMax !== undefined && rawMax !== null && rawMax !== ''
        ? Number(rawMax)
        : DEFAULT_MAX_FILE_SIZE;
  }

  /**
   * Validate, rename, and persist an uploaded image file.
   *
   * @param file - The multer file object from the request.
   * @returns An object containing the public URL and the generated filename.
   * @throws BadRequestException if the MIME type or size is invalid.
   */
  async uploadImage(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
    // Validate MIME type
    if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.mimetype)) {
      throw new BadRequestException(
        `Loại file không hợp lệ. Chỉ chấp nhận: jpg, png, webp (nhận được: ${file.mimetype})`,
      );
    }

    // Validate file size
    if (file.size > this.maxFileSize) {
      const maxMb = (this.maxFileSize / (1024 * 1024)).toFixed(0);
      throw new BadRequestException(
        `File quá lớn. Kích thước tối đa là ${maxMb}MB (nhận được: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`,
      );
    }

    // Ensure upload directory exists
    await mkdir(this.uploadDir, { recursive: true });

    // Generate unique filename: {uuid}.{ext}
    const ext = this.mimeToExt(file.mimetype);
    const filename = `${uuidv4()}.${ext}`;
    const destPath = join(this.uploadDir, filename);

    // Write file buffer to disk
    const { writeFile } = await import('node:fs/promises');
    await writeFile(destPath, file.buffer);

    this.logger.log(`Image uploaded: ${filename} (${file.size} bytes)`);

    return {
      url: `/uploads/${filename}`,
      filename,
    };
  }

  /**
   * Delete an image file from the local filesystem.
   *
   * @param filename - The filename (not the full path) to delete.
   */
  async deleteImage(filename: string): Promise<void> {
    const filePath = join(this.uploadDir, filename);
    try {
      await unlink(filePath);
      this.logger.log(`Image deleted: ${filename}`);
    } catch (err) {
      // Log but don't throw — file may already be gone
      this.logger.warn(`Could not delete image ${filename}: ${String(err)}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private mimeToExt(mime: string): string {
    switch (mime) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      case 'image/webp':
        return 'webp';
      default:
        return 'bin';
    }
  }
}
