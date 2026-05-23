import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User as UserModel } from '../models/user.model';
import { ApiResponse, PaginatedResponse } from '../models/transaction.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/users`;

  getMe(): Observable<UserModel> {
    return this.http.get<ApiResponse<UserModel>>(`${this.base}/me`).pipe(
      map(response => response.data)
    );
  }

  updateMe(data: Partial<UserModel>): Observable<UserModel> {
    return this.http.patch<ApiResponse<UserModel>>(`${this.base}/me`, data).pipe(
      map(response => response.data)
    );
  }

  changePassword(data: { currentPassword: string; newPassword: string; passwordConfirm: string }): Observable<void> {
    return this.http.patch<ApiResponse<void>>(`${this.base}/me/password`, data).pipe(
      map(() => undefined)
    );
  }

  deleteMe(): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/me`).pipe(
      map(() => undefined)
    );
  }

  listUsers(params?: any): Observable<UserModel[]> {
    return this.http.get<PaginatedResponse<UserModel>>(this.base, { params }).pipe(
      map(response => response.data)
    );
  }

  getUserById(id: string): Observable<UserModel> {
    return this.http.get<ApiResponse<UserModel>>(`${this.base}/${id}`).pipe(
      map(response => response.data)
    );
  }

  updateUser(id: string, data: Partial<UserModel>): Observable<UserModel> {
    return this.http.patch<ApiResponse<UserModel>>(`${this.base}/${id}`, data).pipe(
      map(response => response.data)
    );
  }

  setUserStatus(id: string, isActive: boolean): Observable<UserModel> {
    return this.http.patch<ApiResponse<UserModel>>(`${this.base}/${id}/status`, { isActive }).pipe(
      map(response => response.data)
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`).pipe(
      map(() => undefined)
    );
  }
}
