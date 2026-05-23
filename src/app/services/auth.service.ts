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
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
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
    return this.http.get<{ success: boolean; data: User }>(`${this.apiUrl}/me`).pipe(
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
    // If refreshToken is provided (for backward compatibility), don't store it
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getToken(): string | null {
    return this.getAccessToken();
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
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

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        this.clearTokens();
      }
    }
  }

  private saveUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
