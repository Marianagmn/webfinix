// src/app/services/user.service.ts — A-05: renombrado a user.service.ts (desde user.ts)
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { User, UpdateProfileDto, ChangePasswordDto } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/users`;

  me(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.base}/me`);
  }

  updateMe(dto: UpdateProfileDto): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.base}/me`, dto);
  }

  changePassword(dto: ChangePasswordDto): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(`${this.base}/me/password`, dto);
  }

  deleteMe(): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/me`);
  }

  list(params?: Record<string, any>): Observable<PaginatedResponse<User[]>> {
    let httpParams = new HttpParams();
    if (params) Object.entries(params).forEach(([k, v]) => (httpParams = httpParams.set(k, String(v))));
    return this.http.get<PaginatedResponse<User[]>>(this.base, { params: httpParams });
  }

  getById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.base}/${id}`);
  }

  updateUser(id: string, dto: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.base}/${id}`, dto);
  }

  setStatus(id: string, isActive: boolean): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.base}/${id}/status`, { isActive });
  }

  remove(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }
}
