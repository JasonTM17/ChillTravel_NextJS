import { PartialType } from "@nestjs/swagger";
import { CreateCouponDto } from "./create-coupon.dto";

/**
 * DTO for updating an existing coupon.
 * All fields from CreateCouponDto are optional.
 * Req 35 / Design §18.1 Coupon model.
 */
export class UpdateCouponDto extends PartialType(CreateCouponDto) {}
