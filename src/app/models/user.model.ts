// src/app/models/user.model.ts — alineado con backend Finix
import { ApiResponse } from './api-response.model';

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
  businessId?: string; // Required for business finance operations
}

export interface UpdateProfileDto {
  name?: string;
  email?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

// Helper function to check if user has business finance access
export function hasBusinessFinanceAccess(user: User | null): boolean {
  return !!user && !!user.businessId;
}

// Helper function to check if user has specific role
export function hasRole(user: User | null, role: UserRole): boolean {
  return !!user && user.roles.includes(role);
}

export type { ApiResponse };
