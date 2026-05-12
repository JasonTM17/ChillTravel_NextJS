import { IsInt, IsOptional, IsString, Max, Min, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * DTO for creating a new review.
 * Req 13 / Design §3.3 Reviews.
 */
export class CreateReviewDto {
  @ApiProperty({ minimum: 1, maximum: 5, description: "Rating from 1 to 5", example: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiPropertyOptional({ description: "Optional review title", example: "Chuyến đi tuyệt vời!" })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: "Review content (minimum 10 characters)", example: "Tour rất tốt, hướng dẫn viên nhiệt tình và chuyên nghiệp." })
  @IsString()
  @MinLength(10)
  content!: string;
}
