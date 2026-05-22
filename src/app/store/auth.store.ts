// src/app/store/auth.store.ts — con init() para restaurar usuario al cargar (D-05, M-02)
import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { JwtPayload } from '../models/auth.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'finix_access_token';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly http = inject(HttpClient);

  private readonly _token = signal<string | null>(this._loadToken());
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

  private _loadToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private _saveToken(token: string | null): void {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      // ignore en entornos sin localStorage
    }
  }

  setToken(token: string | null): void {
    this._token.set(token);
    this._saveToken(token);
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
