// src/app/services/account.service.ts — C-02, C-04: usa environment + map(r => r.data) + PUT correcto
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account, CreateAccountDTO, UpdateAccountDTO } from '../models/account.model';
import { environment } from '../../environments/environment';

// Interface para respuesta estandarizada del backend
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AccountService {
<<<<<<< HEAD
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/accounts`;
=======
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/accounts`;
>>>>>>> Mariana-Gordillo

  // C-04: map(r => r.data) para desenvolver la respuesta del backend { success, data }
  getAccounts(): Observable<Account[]> {
<<<<<<< HEAD
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
=======
    return this.http.get<ApiResponse<Account[]>>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  getAccountById(id: string): Observable<Account> {
    return this.http.get<ApiResponse<Account>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createAccount(data: CreateAccountDTO): Observable<Account> {
    return this.http.post<ApiResponse<Account>>(this.apiUrl, data).pipe(
      map(response => response.data)
    );
  }

  updateAccount(id: string, data: UpdateAccountDTO): Observable<Account> {
    return this.http.put<ApiResponse<Account>>(`${this.apiUrl}/${id}`, data).pipe(
      map(response => response.data)
    );
  }

  deleteAccount(id: string): Observable<void> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined)
    );
>>>>>>> Mariana-Gordillo
  }
}
