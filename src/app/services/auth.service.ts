import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, LoginResponse, RefreshTokenRequest } from '../models/auth.model';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Load user from API instead of localStorage for security
    // localStorage is vulnerable to XSS attacks
    if (this.isAuthenticated()) {
      this.getProfile().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data);
          } else {
            // Invalid response format, clear tokens
            this.clearTokens();
            this.currentUserSubject.next(null);
          }
        },
        error: (err) => {
          // If profile fetch fails (401, 403, network error, etc.), clear tokens
          console.warn('Failed to fetch user profile:', err);
          this.clearTokens();
          this.currentUserSubject.next(null);
        }
      });
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Basic client-side validation
    if (!credentials.email || !this.isValidEmail(credentials.email)) {
      throw new Error('Email inválido');
    }
    if (!credentials.password) {
      throw new Error('Contraseña requerida');
    }

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.saveTokens(response.data.accessToken, response.data.refreshToken);
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<LoginResponse> {
    // Basic client-side validation
    if (!data.name || data.name.trim().length < 2) {
      throw new Error('Nombre inválido (mínimo 2 caracteres)');
    }
    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error('Email inválido');
    }
    if (!data.password || data.password.length < 8) {
      throw new Error('Contraseña inválida (mínimo 8 caracteres)');
    }
    if (data.password !== data.passwordConfirm) {
      throw new Error('Las contraseñas no coinciden');
    }

    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.saveTokens(response.data.accessToken, response.data.refreshToken);
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  refreshToken(): Observable<LoginResponse> {
    // Backend reads refresh token from httpOnly cookie, not from body
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, {}).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.saveTokens(response.data.accessToken, response.data.refreshToken);
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearTokens();
        this.currentUserSubject.next(null);
      })
    );
  }

  getProfile(): Observable<{ success: boolean; data: User }> {
    // Use /api/users/me instead of /api/auth/me for consistency
    // Both endpoints exist but /api/users/me is the standard one
    return this.http.get<{ success: boolean; data: User }>(`${environment.apiUrl}/users/me`).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.currentUserSubject.next(response.data);
        }
      })
    );
  }

  private saveTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem('accessToken', accessToken);
    // Refresh token is stored in httpOnly cookie by backend, not in localStorage
    // Never store refresh token in localStorage for security (XSS vulnerability)
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    // Refresh token should only be in httpOnly cookie, never in localStorage
    return null;
  }

  getToken(): string | null {
    return this.getAccessToken();
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    // No need to remove refreshToken from localStorage as it should never be there
  }

  removeToken(): void {
    this.clearTokens();
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // REMOVED: loadUserFromStorage() and saveUser() - Never store user data in localStorage (XSS vulnerability)
  // User data should only come from the API
}
