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
