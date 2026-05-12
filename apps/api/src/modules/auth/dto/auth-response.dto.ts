export class UserProfileDto {
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

export class AuthResponseDto {
  accessToken!: string;
  refreshToken!: string;
  user!: UserProfileDto;
}
