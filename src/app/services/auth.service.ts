// src/app/services/auth.service.ts — SERVICIO CANÓNICO (C-02: eliminar auth.ts duplicado)
// usa environment.apiUrl, AuthStore, withCredentials via interceptor
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, throwError } from 'rxjs';
import { LoginRequest, RegisterDto, LoginResponse, RefreshTokenRequest } from '../models/auth.model';
import { User } from '../models/user.model';
import { AuthStore } from '../store/auth.store';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // currentUser$ is a mirror of the store — avoids duplicating state
  get currentUser$() {
    return this.authStore.user;
  }

  get currentUserValue(): User | null {
    return this.authStore.user();
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    if (!credentials.email || !credentials.password) {
      return throwError(() => new Error('Credenciales requeridas'));
    }

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.authStore.setToken(response.data.accessToken);
          this.authStore.setUser(response.data.user);
        }
      })
    );
  }

  register(data: RegisterDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, data, { withCredentials: true }).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.authStore.setToken(response.data.accessToken);
          this.authStore.setUser(response.data.user);
        }
      })
    );
  }

  refreshToken(): Observable<LoginResponse> {
    // The refreshToken is in httpOnly cookie — we send empty body with withCredentials
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, {}, { withCredentials: true }).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.authStore.setToken(response.data.accessToken);
          this.authStore.setUser(response.data.user);
        }
      })
    );
  }



  logout(): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.authStore.clear())
    );
  }

  isAuthenticated(): boolean {
    return this.authStore.isAuthenticated();
  }

  // REMOVED: loadUserFromStorage() and saveUser() - Never store user data in localStorage (XSS vulnerability)
  // User data should only come from the API
}
