import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Account, CreateAccountDto, UpdateAccountDto } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/accounts`;

  list(): Observable<ApiResponse<Account[]>> {
    return this.http.get<ApiResponse<Account[]>>(this.base);
  }

  get(id: string): Observable<ApiResponse<Account>> {
    return this.http.get<ApiResponse<Account>>(`${this.base}/${id}`);
  }

  create(dto: CreateAccountDto): Observable<ApiResponse<Account>> {
    return this.http.post<ApiResponse<Account>>(this.base, dto);
  }

  update(id: string, dto: UpdateAccountDto): Observable<ApiResponse<Account>> {
    return this.http.patch<ApiResponse<Account>>(`${this.base}/${id}`, dto);
  }

  remove(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }
}
