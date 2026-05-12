import { IsIn, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class MockCallbackDto {
  @ApiProperty({ description: "Transaction code from mock-checkout" })
  @IsString()
  transactionCode!: string;

  @ApiProperty({ enum: ["SUCCESS", "FAILED"] })
  @IsString()
  @IsIn(["SUCCESS", "FAILED"])
  status!: "SUCCESS" | "FAILED";
}
