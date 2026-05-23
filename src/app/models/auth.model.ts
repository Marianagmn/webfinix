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
  password?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
  passwordConfirm?: string;
}

export interface RefreshTokenRequest {
  refreshToken?: string; // Optional since backend reads from cookie
}
