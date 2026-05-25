import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/users`;

  /**
   * Obtiene el perfil del usuario autenticado
   * GET /api/users/me
   */
  getMe(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.base}/me`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Actualiza el perfil del usuario autenticado
   * PATCH /api/users/me
   * Body: { name?, email? }
   */
  updateMe(data: { name?: string; email?: string }): Observable<User> {
    return this.http.patch<ApiResponse<User>>(`${this.base}/me`, data).pipe(
      map(response => response.data)
    );
  }

  /**
   * Cambia la contraseña del usuario autenticado
   * PATCH /api/users/me/password
   * Body: { currentPassword, newPassword, newPasswordConfirm }
   */
  changePassword(data: {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
  }): Observable<void> {
    return this.http.patch<ApiResponse<void>>(`${this.base}/me/password`, data).pipe(
      map(() => undefined)
    );
  }

  /**
   * Elimina la cuenta del usuario autenticado (soft delete)
   * DELETE /api/users/me
   */
  deleteMe(): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/me`).pipe(
      map(() => undefined)
    );
  }

  /**
   * [Admin] Lista todos los usuarios con paginación
   * GET /api/users
   * Query params: page, limit, sort, search, isActive, role
   */
  listUsers(params?: any): Observable<{ items: User[]; total: number; meta: any }> {
    return this.http.get<ApiResponse<{ items: User[]; total: number; meta: any }>>(`${this.base}`, { params }).pipe(
      map(response => response.data)
    );
  }

  /**
   * [Admin] Obtiene un usuario por ID
   * GET /api/users/:id
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.base}/${id}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * [Admin] Actualiza un usuario por ID
   * PATCH /api/users/:id
   */
  updateUser(id: string, data: any): Observable<User> {
    return this.http.patch<ApiResponse<User>>(`${this.base}/${id}`, data).pipe(
      map(response => response.data)
    );
  }

  /**
   * [Admin] Activa o desactiva una cuenta
   * PATCH /api/users/:id/status
   * Body: { isActive: boolean }
   */
  setUserStatus(id: string, isActive: boolean): Observable<User> {
    return this.http.patch<ApiResponse<User>>(`${this.base}/${id}/status`, { isActive }).pipe(
      map(response => response.data)
    );
  }

  /**
   * [Superadmin] Elimina un usuario (soft delete)
   * DELETE /api/users/:id
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`).pipe(
      map(() => undefined)
    );
  }
}
