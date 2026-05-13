import type {
  UserProfile as IUserProfile,
  AuthResponse as IAuthResponse,
} from '@vietwander/shared';

export class UserProfileDto implements IUserProfile {
  id!: string;
  email!: string;
  fullName!: string | null;
  phone!: string | null;
  avatarUrl!: string | null;
  role!: string;
  status!: string;
  emailVerified!: boolean;
  createdAt!: Date;
}

export class AuthResponseDto implements IAuthResponse {
  accessToken!: string;
  refreshToken!: string;
  user!: UserProfileDto;
}
