import { Injectable, UnauthorizedException } from "@nestjs/common";
import { demoAccounts, type Role } from "@vietwander/shared";
import jwt from "jsonwebtoken";

@Injectable()
export class AuthService {
  register(email: string, password: string, role: Role = "USER") {
    return this.issueTokens(email, role);
  }

  login(email: string, password: string) {
    const account = demoAccounts.find((item) => item.email === email && item.password === password);
    if (!account) {
      throw new UnauthorizedException("Invalid demo credentials");
    }
    return this.issueTokens(account.email, account.role);
  }

  me(email = "user@vietwander.ai", role: Role = "USER") {
    return { id: "demo-user", email, role, travelStyle: "Culture Seeker" };
  }

  private issueTokens(email: string, role: Role) {
    const accessSecret = process.env.JWT_ACCESS_SECRET ?? "local_access_secret_change_me";
    const refreshSecret = process.env.JWT_REFRESH_SECRET ?? "local_refresh_secret_change_me";
    const payload = { sub: email, role };
    return {
      user: { id: "demo-" + role.toLowerCase(), email, role },
      accessToken: jwt.sign(payload, accessSecret, { expiresIn: "15m" }),
      refreshToken: jwt.sign(payload, refreshSecret, { expiresIn: "7d" })
    };
  }
}
