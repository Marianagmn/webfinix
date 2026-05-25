// src/app/services/business-finance/business-finance-crud.service.ts
// CRUD operations for business finance transactions
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusinessFinance, CreateBusinessFinanceDto, UpdateBusinessFinanceDto } from '../../models/transaction.model';
import { ApiResponse, PaginatedResponse } from '../../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BusinessFinanceCrudService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/business-finance`;

  getTransactions(params?: any): Observable<PaginatedResponse<BusinessFinance>> {
    return this.http.get<PaginatedResponse<BusinessFinance>>(this.base, { params });
  }

  getTransactionsPaginated(page: number = 1, limit: number = 10, filters?: any): Observable<PaginatedResponse<BusinessFinance>> {
    const params: any = { page, limit, ...filters };
    return this.http.get<PaginatedResponse<BusinessFinance>>(this.base, { params });
  }

  getTransactionById(id: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.get<ApiResponse<BusinessFinance>>(`${this.base}/${id}`);
  }

  createTransaction(data: CreateBusinessFinanceDto): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(this.base, data);
  }

  updateTransaction(id: string, data: UpdateBusinessFinanceDto): Observable<ApiResponse<BusinessFinance>> {
    return this.http.put<ApiResponse<BusinessFinance>>(`${this.base}/${id}`, data);
  }

  deleteTransaction(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`);
  }
}
