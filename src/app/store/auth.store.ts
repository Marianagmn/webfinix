// src/app/store/auth.store.ts — Angular Signals store for authentication
// PHASE 3 FIX: Removed localStorage for token storage (XSS vulnerability)
// Access token is kept in memory only; refresh token is in httpOnly cookie
import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  // C-03: roles es array
  readonly roles = computed(() => this._user()?.roles ?? []);
  readonly hasRole = (role: string) => computed(() => this.roles().includes(role as any));

  // M-02: restaurar usuario desde el backend al arrancar la app
  init(): void {
    if (this._token()) {
      this.http
        .get<ApiResponse<User>>(`${environment.apiUrl}/auth/me`, { withCredentials: true })
        .subscribe({
          next: (res) => this._user.set(res.data),
          error: () => this.clear(), // token inválido o expirado — limpiar
        });
    }
  }

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

  getPayload(): JwtPayload | null {
    const token = this._token();
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload as JwtPayload;
    } catch {
      return null;
    }
  }
}
