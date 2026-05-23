// src/app/services/personal-finance/personal-finance-crud.service.ts
// CRUD operations for personal finance transactions
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonalFinance, CreatePersonalFinanceDto, UpdatePersonalFinanceDto } from '../../models/transaction.model';
import { ApiResponse, PaginatedResponse } from '../../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PersonalFinanceCrudService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/personal-finance`;

  getTransactions(params?: any): Observable<PaginatedResponse<PersonalFinance>> {
    return this.http.get<PaginatedResponse<PersonalFinance>>(this.base, { params });
  }

  getTransactionsPaginated(page: number = 1, limit: number = 10, filters?: any): Observable<PaginatedResponse<PersonalFinance>> {
    const params: any = { page, limit, ...filters };
    return this.http.get<PaginatedResponse<PersonalFinance>>(this.base, { params });
  }

  getTransactionById(id: string): Observable<ApiResponse<PersonalFinance>> {
    return this.http.get<ApiResponse<PersonalFinance>>(`${this.base}/${id}`);
  }

  createTransaction(data: CreatePersonalFinanceDto): Observable<ApiResponse<PersonalFinance>> {
    return this.http.post<ApiResponse<PersonalFinance>>(this.base, data);
  }

  updateTransaction(id: string, data: UpdatePersonalFinanceDto): Observable<ApiResponse<PersonalFinance>> {
    return this.http.put<ApiResponse<PersonalFinance>>(`${this.base}/${id}`, data);
  }

  deleteTransaction(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`);
  }
}
