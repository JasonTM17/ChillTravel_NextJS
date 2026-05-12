import { IsEmail, IsOptional, IsString, Matches, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ example: "Nguyễn Văn A" })
  @IsString()
  @MinLength(2)
  fullName!: string;

  @ApiProperty({ example: "user@wanderviet.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "Password@123", minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({ example: "+84901234567" })
  @IsOptional()
  @IsString()
  @Matches(/^(\+84|0)[0-9]{9,10}$/, { message: "phone must be a valid Vietnamese phone number" })
  phone?: string;
}
