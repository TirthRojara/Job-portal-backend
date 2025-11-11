import { AuthType } from '@prisma/client';
import { ROLE } from '../auth/auth.interface';

export interface IUserUpdate {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  authType: AuthType;
  OauthId: string | null;
}

export interface IUser extends IUserUpdate {
  role: ROLE;
}


