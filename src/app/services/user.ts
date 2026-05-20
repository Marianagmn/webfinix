import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User as UserModel, ApiResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) { }

  getMe(): Observable<ApiResponse<UserModel>> {
    return this.http.get<ApiResponse<UserModel>>(`${this.apiUrl}/me`);
  }

  updateMe(data: Partial<UserModel>): Observable<ApiResponse<UserModel>> {
    return this.http.patch<ApiResponse<UserModel>>(`${this.apiUrl}/me`, data);
  }

  changePassword(data: { currentPassword: string; newPassword: string; passwordConfirm: string }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/me/password`, data);
  }

  deleteMe(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/me`);
  }

  listUsers(): Observable<ApiResponse<UserModel[]>> {
    return this.http.get<ApiResponse<UserModel[]>>(this.apiUrl);
  }

  getUserById(id: string): Observable<ApiResponse<UserModel>> {
    return this.http.get<ApiResponse<UserModel>>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, data: Partial<UserModel>): Observable<ApiResponse<UserModel>> {
    return this.http.patch<ApiResponse<UserModel>>(`${this.apiUrl}/${id}`, data);
  }

  setUserStatus(id: string, isActive: boolean): Observable<ApiResponse<UserModel>> {
    return this.http.patch<ApiResponse<UserModel>>(`${this.apiUrl}/${id}/status`, { isActive });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
