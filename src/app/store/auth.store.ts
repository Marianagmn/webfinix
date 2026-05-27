// src/app/store/auth.store.ts — Angular Signals store for authentication
// PHASE 3 FIX: Removed localStorage for token storage (XSS vulnerability)
// Access token is kept in memory only; refresh token is in httpOnly cookie
import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { JwtPayload } from '../models/auth.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly http = inject(HttpClient);

  // Access token stored in memory only (no localStorage - XSS protection)
  private readonly _token = signal<string | null>(null);
  readonly token = computed(() => this._token());

  private readonly _user = signal<User | null>(null);
  readonly user = computed(() => this._user());

  readonly isAuthenticated = computed(() => !!this._token());

  // MEDIA #2: Refresh token management (formerly in interceptor module scope)
  private readonly _isRefreshing = signal(false);
  readonly isRefreshing = computed(() => this._isRefreshing());

  private readonly _refreshToken$ = new BehaviorSubject<string | null>(null);
  readonly refreshToken$ = this._refreshToken$.asObservable();

  // C-03: roles es array
  readonly roles = computed(() => this._user()?.roles ?? []);
  readonly hasRole = (role: string) => computed(() => this.roles().includes(role as any));


  setToken(token: string | null): void {
    this._token.set(token);
    // SECURITY FIX: No longer saving to localStorage (XSS vulnerability)
    // Token is kept in memory only; refresh token is in httpOnly cookie
  }

  setUser(user: User | null): void {
    this._user.set(user);
  }

  clear(): void {
    this.setToken(null);
    this.setUser(null);
  }

  setRefreshing(isRefreshing: boolean): void {
    this._isRefreshing.set(isRefreshing);
  }

  setRefreshToken(token: string | null): void {
    this._refreshToken$.next(token);
  }

  getPayload(): JwtPayload | null {
    const token = this._token();
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      // Validate expiration
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        this.clear();
        return null;
      }
      return payload as JwtPayload;
    } catch {
      return null;
    }
  }
}
