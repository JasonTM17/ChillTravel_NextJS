import { Body, Controller, Get, Post } from "@nestjs/common";
import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { envelope, type Role } from "@vietwander/shared";
import { AuthService } from "./auth.service";

class AuthDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsIn(["USER", "HOST", "GUIDE", "ADMIN"])
  role?: Role;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("register")
  register(@Body() body: AuthDto) {
    return envelope(this.auth.register(body.email, body.password, body.role), "Registered demo user");
  }

  @Post("login")
  login(@Body() body: AuthDto) {
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
  me() {
    return envelope(this.auth.me());
  }
}
