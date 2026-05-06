import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { envelope, type AuthLoginRequest, type AuthRegisterRequest, type Role } from "@vietwander/shared";
import { AuthService } from "./auth.service";
import { CurrentUser, JwtAuthGuard, type AuthUser } from "./security";

class LoginDto implements AuthLoginRequest {
  @IsEmail()
  @MaxLength(160)
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(120)
  password!: string;
}

class RegisterDto extends LoginDto implements AuthRegisterRequest {
  @IsOptional()
  @IsIn(["USER", "HOST", "GUIDE", "ADMIN"])
  role?: Role;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("register")
  register(@Body() body: RegisterDto) {
    return envelope(this.auth.register(body.email, body.password, body.role), "Registered demo user");
  }

  @Post("login")
  login(@Body() body: LoginDto) {
    return envelope(this.auth.login(body.email, body.password), "Logged in with demo credentials");
  }

  @Post("refresh")
  refresh() {
    return envelope({ accessToken: "mock-refreshed-access-token" }, "Refresh token accepted in local demo");
  }

  @Post("logout")
  logout() {
    return envelope({ revoked: true }, "Logged out");
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthUser) {
    return envelope(this.auth.me(user.sub, user.role));
  }
}
