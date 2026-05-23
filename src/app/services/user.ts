import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User as UserModel, ApiResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/users`;

  getMe(): Observable<ApiResponse<UserModel>> {
    return this.http.get<ApiResponse<UserModel>>(`${this.base}/me`);
  }

  updateMe(data: Partial<UserModel>): Observable<ApiResponse<UserModel>> {
    return this.http.patch<ApiResponse<UserModel>>(`${this.base}/me`, data);
  }

  changePassword(data: { currentPassword: string; newPassword: string; passwordConfirm: string }): Observable<any> {
    return this.http.patch(`${this.base}/me/password`, data);
  }

  deleteMe(): Observable<any> {
    return this.http.delete(`${this.base}/me`);
  }

  listUsers(): Observable<ApiResponse<UserModel[]>> {
    return this.http.get<ApiResponse<UserModel[]>>(this.base);
  }

  getUserById(id: string): Observable<ApiResponse<UserModel>> {
    return this.http.get<ApiResponse<UserModel>>(`${this.base}/${id}`);
  }

  updateUser(id: string, data: Partial<UserModel>): Observable<ApiResponse<UserModel>> {
    return this.http.patch<ApiResponse<UserModel>>(`${this.base}/${id}`, data);
  }

  setUserStatus(id: string, isActive: boolean): Observable<ApiResponse<UserModel>> {
    return this.http.patch<ApiResponse<UserModel>>(`${this.base}/${id}/status`, { isActive });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
