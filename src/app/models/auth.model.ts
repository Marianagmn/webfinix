// src/app/models/auth.model.ts — limpio, sin duplicados
import { User } from './user.model';

export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken?: string; // Optional since it comes in httpOnly cookie
    user: User;
  };
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface RefreshTokenRequest {
  refreshToken?: string; // Optional since backend reads from cookie
}

// JWT payload structure for token decoding
export interface JwtPayload {
  userId: string;
  email: string;
  roles: string[];
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
  iss?: string;
}
