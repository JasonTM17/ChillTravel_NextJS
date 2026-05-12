import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import { memoryStorage } from "multer";
import { Roles } from "../../common/decorators/roles.decorator";
import { LocalUploadService } from "../../common/services/upload.service";

/**
 * UploadController — handles image uploads for admin users.
 *
 * POST /admin/uploads/images
 *   - Accepts multipart/form-data with a single file field named "file".
 *   - Validates MIME type (jpg/png/webp) and size (≤ MAX_FILE_SIZE).
 *   - Generates a UUID-based filename and saves to UPLOAD_DIR.
 *   - Returns { url, filename } where url is the public /uploads/{filename} path.
 *
 * Req 18 / Design §9.
 */
@ApiTags("Upload")
@Controller("admin/uploads")
export class UploadController {
  constructor(private readonly uploadService: LocalUploadService) {}

  /**
   * POST /admin/uploads/images
   * Upload a single image file (jpg, png, or webp).
   * Requires ADMIN role.
   */
  @Post("images")
  @Roles("ADMIN")
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      // Note: size/mime validation is handled in LocalUploadService
      // to keep the controller thin and the service testable.
    })
  )
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiOperation({
    summary: "Upload an image (Admin)",
    description:
      "Upload a single image file (jpg, png, or webp). " +
      "Max size is controlled by MAX_FILE_SIZE env var (default 5 MB). " +
      "Returns the public URL and generated filename. Requires ADMIN role."
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["file"],
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "Image file (jpg, png, or webp)"
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: "Image uploaded successfully",
    schema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          example: "/uploads/550e8400-e29b-41d4-a716-446655440000.jpg"
        },
        filename: {
          type: "string",
          example: "550e8400-e29b-41d4-a716-446655440000.jpg"
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: "Invalid file type or file too large" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden — ADMIN role required" })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File
  ): Promise<{ url: string; filename: string }> {
    return this.uploadService.uploadImage(file);
  }
}
