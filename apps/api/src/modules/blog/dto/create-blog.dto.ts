import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * DTO for creating a new blog post.
 *
 * Req 15 / Design §3.3 Blog.
 */
export class CreateBlogDto {
  @ApiProperty({ description: 'Blog post title', minLength: 3, example: 'Khám phá Hội An cổ kính' })
  @IsString()
  @MinLength(3)
  title!: string;

  @ApiPropertyOptional({
    description: 'Short excerpt / summary',
    example: 'Hội An là một trong những điểm đến đẹp nhất Việt Nam...',
  })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({
    description: 'Full blog post content (HTML or Markdown)',
    minLength: 10,
    example: 'Hội An nằm ở miền Trung Việt Nam...',
  })
  @IsString()
  @MinLength(10)
  content!: string;

  @ApiPropertyOptional({
    description: 'Cover image URL',
    example: 'https://example.com/images/hoi-an.jpg',
  })
  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @ApiPropertyOptional({ description: 'Blog category', example: 'Điểm đến' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    enum: ['DRAFT', 'PUBLISHED'],
    default: 'DRAFT',
    description: 'Publication status. Defaults to DRAFT.',
  })
  @IsOptional()
  @IsIn(['DRAFT', 'PUBLISHED'])
  status?: 'DRAFT' | 'PUBLISHED';
}
