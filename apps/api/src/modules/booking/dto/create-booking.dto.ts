import { IsArray, IsEmail, IsInt, IsOptional, IsString, Min, MinLength, ValidateNested } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class BookingGuestDto {
  @ApiProperty({ example: "Nguyen Van A" })
  @IsString()
  @MinLength(2)
  fullName!: string;

  @ApiPropertyOptional({ example: "1990-01-15" })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: "MALE" })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ example: "Vegetarian meal" })
  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateBookingDto {
  @ApiProperty({ example: "clxyz123" })
  @IsString()
  tourId!: string;

  @ApiPropertyOptional({ example: "clxyz456", description: "TourDeparture ID (optional)" })
  @IsOptional()
  @IsString()
  departureId?: string;

  @ApiPropertyOptional({ example: "SUMMER20", description: "Coupon code for discount" })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiProperty({ example: "Nguyen Van A" })
  @IsString()
  @MinLength(2)
  contactName!: string;

  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  contactEmail!: string;

  @ApiProperty({ example: "0901234567" })
  @IsString()
  contactPhone!: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  numberOfGuests!: number;

  @ApiPropertyOptional({ example: "Window seat preferred" })
  @IsOptional()
  @IsString()
  specialRequest?: string;

  @ApiPropertyOptional({ type: [BookingGuestDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingGuestDto)
  guests?: BookingGuestDto[];
}
