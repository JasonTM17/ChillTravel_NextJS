import { PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './create-blog.dto';

/**
 * DTO for updating an existing blog post.
 * All fields from CreateBlogDto are optional.
 *
 * Req 15 / Design §3.3 Blog.
 */
export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
