import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";
import { demoPaymentMethods, envelope, type BookingCreateRequest, type PaymentConfirmRequest, type PaymentMethod } from "@vietwander/shared";
import { BookingService } from "./booking.service";

class BookingDto implements BookingCreateRequest {
  @IsString()
  @MaxLength(120)
  itemName!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000000000)
  amount!: number;

  @IsIn(demoPaymentMethods)
  method!: PaymentMethod;
}

class PaymentConfirmDto implements PaymentConfirmRequest {
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
    return envelope(this.bookings.create(body), "Đặt chỗ demo đã được xác nhận");
  }

  @Get("bookings/:code")
  find(@Param("code") code: string) {
    return envelope(this.bookings.find(code), "Đã tải đặt chỗ demo");
  }

  @Post("payments/mock")
  payment(@Body() body: BookingDto) {
    return envelope(this.bookings.create(body), "Đã nhận phương thức thanh toán demo");
  }

  @Post("payments/mock/confirm")
  confirm(@Body() body: PaymentConfirmDto = {}) {
    return envelope({ bookingCode: body.bookingCode ?? "CT-MOCK", status: "confirmed_mock", warning: "Thanh toán demo — không phát sinh giao dịch thật" }, "Thanh toán demo đã được xác nhận");
  }

  @Post("bookings/:id/cancel")
  cancel(@Param("id") id: string) {
    return envelope(this.bookings.cancel(id), "Đặt chỗ demo đã được hủy");
  }
}
