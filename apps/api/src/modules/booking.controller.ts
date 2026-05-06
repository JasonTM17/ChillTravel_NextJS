import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";
import { demoPaymentMethods, envelope } from "@vietwander/shared";
import { BookingService } from "./booking.service";

class BookingDto {
  @IsString()
  @MaxLength(120)
  itemName!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000000000)
  amount!: number;

  @IsIn(demoPaymentMethods)
  method!: (typeof demoPaymentMethods)[number];
}

class PaymentConfirmDto {
  @IsOptional()
  @IsString()
  @MaxLength(40)
  bookingCode?: string;
}

@Controller()
export class BookingController {
  constructor(private readonly bookings: BookingService) {}

  @Post("bookings")
  create(@Body() body: BookingDto) {
    return envelope(this.bookings.create(body), "Mock booking confirmed");
  }

  @Get("bookings/:code")
  find(@Param("code") code: string) {
    return envelope(this.bookings.find(code), "Booking loaded");
  }

  @Post("payments/mock")
  payment(@Body() body: BookingDto) {
    return envelope(this.bookings.create(body), "Mock payment token accepted");
  }

  @Post("payments/mock/confirm")
  confirm(@Body() body: PaymentConfirmDto = {}) {
    return envelope({ bookingCode: body.bookingCode ?? "VW-MOCK", status: "confirmed_mock", warning: "Demo payment only - no real transaction" }, "Mock payment confirmed");
  }

  @Post("bookings/:id/cancel")
  cancel(@Param("id") id: string) {
    return envelope(this.bookings.cancel(id), "Mock booking cancelled");
  }
}
