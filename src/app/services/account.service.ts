import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account, CreateAccountDTO, UpdateAccountDTO } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private apiUrl = '/api/accounts';

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl);
  }

  getAccountById(id: string): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`);
  }

  createAccount(data: CreateAccountDTO): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, data);
  }

  updateAccount(id: string, data: UpdateAccountDTO): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${id}`, data);
  }

  deleteAccount(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
