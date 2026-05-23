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
  businessId?: string; // Required for business finance operations
}

// Helper function to check if user has business finance access
export function hasBusinessFinanceAccess(user: User | null): boolean {
  return !!user && !!user.businessId;
}

// Helper function to check if user has specific role
export function hasRole(user: User | null, role: string): boolean {
  return !!user && user.roles.includes(role);
}

export type { ApiResponse };
