import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { IsNumber, IsString } from "class-validator";
import { envelope } from "@vietwander/shared";
import { BookingService } from "./booking.service";

class BookingDto {
  @IsString()
  itemName!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  method!: string;
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
  confirm() {
    return envelope({ status: "confirmed_mock", warning: "Demo payment — no real transaction" }, "Mock payment confirmed");
  }

  @Post("bookings/:id/cancel")
  cancel(@Param("id") id: string) {
    return envelope(this.bookings.cancel(id), "Mock booking cancelled");
  }
}
