// src/app/services/account.service.ts — C-02, C-04: usa environment + map(r => r.data) + PUT correcto
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account, CreateAccountDto, UpdateAccountDto } from '../models/account.model';
import { ApiResponse, PaginatedResponse } from '../models/transaction.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/accounts`;

  getAccounts(params?: any): Observable<Account[]> {
    // Backend devuelve ApiResponse wrapper, necesitamos extraer data
    return this.http.get<ApiResponse<Account[]>>(this.base, { params }).pipe(
      map(response => response.data)
    );
  }

  getAccountById(id: string): Observable<Account> {
    return this.http.get<ApiResponse<Account>>(`${this.base}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createAccount(data: CreateAccountDto): Observable<Account> {
    return this.http.post<ApiResponse<Account>>(this.base, data).pipe(
      map(response => response.data)
    );
  }

  updateAccount(id: string, data: UpdateAccountDto): Observable<Account> {
    return this.http.put<ApiResponse<Account>>(`${this.base}/${id}`, data).pipe(
      map(response => response.data)
    );
  }

  deleteAccount(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`).pipe(
      map(() => undefined)
    );
  }
}
