// src/app/models/auth.model.ts
import { User } from './user.model';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name?: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface JwtPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
  type: 'access' | 'refresh';
}
import { User } from './user.model';

export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
  passwordConfirm?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
