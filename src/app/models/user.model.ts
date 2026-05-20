// src/app/models/user.model.ts
export type UserRole = 'user' | 'admin' | 'superadmin' | 'aprobador' | 'contador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateProfileDto {
  name?: string;
  email?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}
import { ApiResponse } from './transaction.model';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  provider: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt: string;
  createdAt: string;
}

export { ApiResponse };
