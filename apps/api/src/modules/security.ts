/**
 * @deprecated Use guards from apps/api/src/common/guards/ instead.
 * This file is kept temporarily for backward compatibility during migration.
 * Will be removed in a later task.
 */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type Role } from '@vietwander/shared';
import jwt from 'jsonwebtoken';

export const ROLES_KEY = 'vietwander:roles';

export type AuthUser = {
  sub: string;
  role: Role;
};

type RequestWithUser = {
  headers: Record<string, string | string[] | undefined>;
  user?: AuthUser;
};

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<RequestWithUser>();
  return request.user;
});

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authorization = request.headers.authorization;
    const value = Array.isArray(authorization) ? authorization[0] : authorization;
    const token = value?.startsWith('Bearer ') ? value.slice('Bearer '.length) : undefined;

    if (!token) {
      throw new UnauthorizedException('Bearer token required');
    }

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET ?? 'local_access_secret_change_me',
      ) as Partial<AuthUser>;
      if (!payload.sub || !isRole(payload.role)) {
        throw new UnauthorizedException('Invalid access token');
      }
      request.user = { sub: payload.sub, role: payload.role };
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid access token');
    }
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    if (!request.user) {
      throw new UnauthorizedException('Authenticated user required');
    }
    if (!roles.includes(request.user.role)) {
      throw new ForbiddenException('Insufficient role');
    }
    return true;
  }
}

function isRole(value: unknown): value is Role {
  return value === 'USER' || value === 'HOST' || value === 'GUIDE' || value === 'ADMIN';
}
