// src/app/models/user.model.ts — alineado con backend Finix
export type UserRole = 'user' | 'admin' | 'superadmin' | 'aprobador' | 'contador';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];       // ← array, no string único (corrección C-03)
  provider: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt: string | null;
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
