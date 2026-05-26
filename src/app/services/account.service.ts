// src/app/services/account.service.ts — C-02, C-04: usa environment + map(r => r.data) + PUT correcto
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account, CreateAccountDto, UpdateAccountDto } from '../models/account.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/accounts`;

  private normalizeId<T extends { id?: string; _id?: string }>(item: T): T & { id: string } {
    return {
      ...item,
      id: item.id ?? (item as any)._id ?? '',
    } as T & { id: string };
  }

  getAccounts(page = 1, limit = 20): Observable<PaginatedResponse<Account>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse<Account>>(this.apiUrl, { params }).pipe(
      map((response) => ({
        ...response,
        data: response.data.map((account) => this.normalizeId(account))
      }))
    );
  }

  getAccountById(id: string): Observable<Account> {
    return this.http.get<ApiResponse<Account>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => this.normalizeId(response.data))
    );
  }

  createAccount(data: CreateAccountDto): Observable<Account> {
    return this.http.post<ApiResponse<Account>>(this.apiUrl, data).pipe(
      map((response) => this.normalizeId(response.data))
    );
  }

  updateAccount(id: string, data: UpdateAccountDto): Observable<Account> {
    return this.http.put<ApiResponse<Account>>(`${this.apiUrl}/${id}`, data).pipe(
      map((response) => this.normalizeId(response.data))
    );
  }

  deleteAccount(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined)
    );
  }
}
