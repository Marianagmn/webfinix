import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthStore } from '../store/auth.store';
import { ApiResponse } from '../models/api-response.model';
import { LoginDto, RegisterDto, AuthResponse } from '../models/auth.model';
import { User, UpdateProfileDto, ChangePasswordDto } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly base = `${environment.apiUrl}/auth`;

  login(dto: LoginDto): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.base}/login`, dto).pipe(
      tap((res) => {
        if (res.success) {
          this.authStore.setToken(res.data.accessToken);
          this.authStore.setUser(res.data.user);
        }
      })
    );
  }

  register(dto: RegisterDto): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.base}/register`, dto).pipe(
      tap((res) => {
        if (res.success) {
          this.authStore.setToken(res.data.accessToken);
          this.authStore.setUser(res.data.user);
        }
      })
    );
  }

  logout(): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.base}/logout`, null).pipe(
      tap(() => this.authStore.clear())
    );
  }

  refresh(): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.base}/refresh`, {}).pipe(
      tap((res) => {
        if (res.success) {
          this.authStore.setToken(res.data.accessToken);
          this.authStore.setUser(res.data.user);
        }
      })
    );
  }

  me(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.base}/me`).pipe(
      tap((res) => {
        if (res.success) this.authStore.setUser(res.data);
      })
    );
  }

  updateProfile(dto: UpdateProfileDto): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.base}/me`, dto).pipe(
      tap((res) => {
        if (res.success) this.authStore.setUser(res.data);
      })
    );
  }

  changePassword(dto: ChangePasswordDto): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(`${this.base}/me/password`, dto);
  }
}
