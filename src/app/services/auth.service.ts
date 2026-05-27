// src/app/services/auth.service.ts — SERVICIO CANÓNICO (C-02: eliminar auth.ts duplicado)
// usa environment.apiUrl, AuthStore, withCredentials via interceptor
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse, ApiResult } from '../models/api-response.model';
import { LoginRequest, AuthResponse, RegisterDto } from '../models/auth.model';
import { User } from '../models/user.model';
import { AuthStore } from '../store/auth.store';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  get currentUser$() {
    return this.authStore.user;
  }

  login(dto: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, dto, {
      withCredentials: true,
    }).pipe(
      tap((res) => {
        if (res.success) {
          this.authStore.setToken(res.data.accessToken);
          this.authStore.setUser(res.data.user);
        }
      })
    );
  }

  register(dto: RegisterDto): Observable<ApiResult<AuthResponse>> {
    return this.http.post<ApiResult<AuthResponse>>(`${this.apiUrl}/register`, dto, {
      withCredentials: true,
    }).pipe(
      tap((res) => {
        if (res.success) {
          this.authStore.setToken(res.data.accessToken);
          this.authStore.setUser(res.data.user);
        }
      })
    );
  }

  logout(): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/logout`, {}, {
      withCredentials: true,
    }).pipe(
      tap(() => this.authStore.clear())
    );
  }

  refresh(): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/refresh`, {}, {
      withCredentials: true,
    }).pipe(
      tap((res) => {
        if (res.success) {
          this.authStore.setToken(res.data.accessToken);
          this.authStore.setUser(res.data.user);
        }
      })
    );
  }

  me(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/me`, {
      withCredentials: true,
    }).pipe(
      tap((res) => {
        if (res.success) this.authStore.setUser(res.data);
      })
    );
  }

  forgotPassword(email: string): Observable<ApiResponse<{ message: string; resetToken?: string }>> {
    return this.http.post<ApiResponse<{ message: string; resetToken?: string }>>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.post<ApiResponse<{ message: string }>>(`${this.apiUrl}/reset-password`, { token, password });
  }
}
