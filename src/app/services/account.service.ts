// src/app/services/account.service.ts — C-02, C-04: usa environment + map(r => r.data) + PUT correcto
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Account, CreateAccountDto, UpdateAccountDto } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/accounts`;

  // C-04: map(r => r.data) para desenvolver la respuesta del backend { success, data }
  getAccounts(): Observable<Account[]> {
    return this.http.get<ApiResponse<Account[]>>(this.base).pipe(map((r) => r.data));
  }

  getAccountById(id: string): Observable<Account> {
    return this.http.get<ApiResponse<Account>>(`${this.base}/${id}`).pipe(map((r) => r.data));
  }

  createAccount(dto: CreateAccountDto): Observable<Account> {
    return this.http.post<ApiResponse<Account>>(this.base, dto).pipe(map((r) => r.data));
  }

  // M-05: backend usa PUT para actualizar cuentas
  updateAccount(id: string, dto: UpdateAccountDto): Observable<Account> {
    return this.http.put<ApiResponse<Account>>(`${this.base}/${id}`, dto).pipe(map((r) => r.data));
  }

  deleteAccount(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }
}
