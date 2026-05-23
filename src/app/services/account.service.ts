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

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/accounts`;

  getAccounts(): Observable<Account[]> {
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
  }
}
