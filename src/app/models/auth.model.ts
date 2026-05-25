// src/app/models/auth.model.ts — limpio, sin duplicados
import { User } from './user.model';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface JwtPayload {
  userId: string;
  roles: string[];
  iat?: number;
  exp?: number;
  type: 'access' | 'refresh';
}
