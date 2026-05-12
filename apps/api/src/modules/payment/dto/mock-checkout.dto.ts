import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class MockCheckoutDto {
  @ApiProperty({ description: "Booking ID to initiate payment for" })
  @IsString()
  bookingId!: string;
}
