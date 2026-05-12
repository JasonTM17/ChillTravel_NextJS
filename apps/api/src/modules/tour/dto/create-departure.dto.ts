import { IsDateString, IsInt, IsOptional, IsString, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * DTO for creating a tour departure.
 * Design §18.1 TourDeparture / Req 34.
 */
export class CreateDepartureDto {
  @ApiProperty({ description: "Departure date (ISO 8601)", example: "2025-07-15" })
  @IsDateString()
  departureDate!: string;

  @ApiPropertyOptional({ description: "Return date (ISO 8601)", example: "2025-07-18" })
  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @ApiProperty({ description: "Available slots for this departure", minimum: 0, example: 20 })
  @IsInt()
  @Min(0)
  availableSlots!: number;

  @ApiPropertyOptional({ description: "Price override for this departure in VND (null = use tour basePrice)", minimum: 0, example: 2200000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  priceOverride?: number;

  @ApiPropertyOptional({ description: "Departure status: OPEN | CLOSED | SOLDOUT", default: "OPEN", example: "OPEN" })
  @IsOptional()
  @IsString()
  status?: string;
}
