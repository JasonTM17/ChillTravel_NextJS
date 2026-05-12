import { IsInt, IsOptional, IsString, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * DTO for adding or updating a tour itinerary day.
 * Upserted by (tourId, dayNumber) unique constraint.
 * Design §3.3 Tours / Req 8.
 */
export class CreateItineraryDto {
  @ApiProperty({ description: "Day number in the itinerary (1-based)", minimum: 1, example: 1 })
  @IsInt()
  @Min(1)
  dayNumber!: number;

  @ApiProperty({ description: "Title for this day", example: "Arrival & City Orientation" })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ description: "Detailed description of the day's activities" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: "Meals included (e.g. Breakfast, Lunch, Dinner)", example: "Breakfast, Dinner" })
  @IsOptional()
  @IsString()
  meals?: string;

  @ApiPropertyOptional({ description: "Accommodation details", example: "4-star hotel in city center" })
  @IsOptional()
  @IsString()
  accommodation?: string;

  @ApiPropertyOptional({ description: "Activities for the day", example: "City tour, museum visit" })
  @IsOptional()
  @IsString()
  activities?: string;
}
