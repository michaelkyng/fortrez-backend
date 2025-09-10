import { User } from '../schemas';
import { Types } from 'mongoose';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin'
}

export interface SafeUser extends Omit<User, 'password'> {
    _id: Types.ObjectId;
    name: string;
    email: string;
    role: UserRole;
  }
  