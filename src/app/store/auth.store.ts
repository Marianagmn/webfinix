import { Injectable, computed, signal } from '@angular/core';
import { User } from '../models/user.model';
import { JwtPayload } from '../models/auth.model';

const TOKEN_KEY = 'finix_access_token';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _token = signal<string | null>(this._loadToken());
  readonly token = computed(() => this._token());

  private readonly _user = signal<User | null>(null);
  readonly user = computed(() => this._user());

  readonly isAuthenticated = computed(() => !!this._token());
  readonly role = computed(() => this._user()?.role ?? null);

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
      // ignore
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
