import { UserRole } from './user.interface';
import { SafeUser } from './user.interface';

export interface RegisterResponse {
  message: string;
  user: SafeUser;
}

export interface LoginResponse {
  message: string,
  accessToken: string,
  user: SafeUser,
};

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

import { Request } from 'express';

export interface JwtRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}
