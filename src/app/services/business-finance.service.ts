import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import {
  BusinessFinance,
  BusinessTransactionTipo,
  CreateBusinessFinanceRequest,
  UpdateBusinessFinanceRequest,
  ApplyPaymentDto,
} from '../models/business-finance.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BusinessFinanceService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/business-finance`;

  getTransactions(filter?: Record<string, any>): Observable<PaginatedResponse<BusinessFinance>> {
    let params = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([k, v]) => {
        if (v !== undefined && v !== null) params = params.set(k, String(v));
      });
    }
    return this.http.get<PaginatedResponse<BusinessFinance>>(this.apiUrl, { params });
  }

  getTransactionById(id: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.get<ApiResponse<BusinessFinance>>(`${this.apiUrl}/${id}`);
  }

  createTransaction(dto: CreateBusinessFinanceRequest): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(this.apiUrl, dto);
  }

  updateTransaction(id: string, dto: UpdateBusinessFinanceRequest): Observable<ApiResponse<BusinessFinance>> {
    return this.http.put<ApiResponse<BusinessFinance>>(`${this.apiUrl}/${id}`, dto);
  }

  deleteTransaction(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  submitForApproval(id: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.apiUrl}/${id}/submit`, {});
  }

  approve(id: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.apiUrl}/${id}/approve`, {});
  }

  reject(id: string, motivo?: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.apiUrl}/${id}/reject`, { motivo });
  }

  post(id: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.apiUrl}/${id}/post`, {});
  }

  reverse(id: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.apiUrl}/${id}/reverse`, {});
  }

  /**
   * Revierte un registro contable.
   * @param id ID del registro a revertir
   * @param payload Datos de la reversión (motivo, referencia)
   */
  reverseRecord(id: string, payload: { motivo: string; referencia?: string }): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.apiUrl}/${id}/reverse`, payload);
  }

  applyPayment(id: string, dto: ApplyPaymentDto): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.apiUrl}/${id}/payments`, dto);
  }

  getPendingApprovals(): Observable<PaginatedResponse<BusinessFinance>> {
    return this.http.get<PaginatedResponse<BusinessFinance>>(`${this.apiUrl}/approvals/pending`);
  }

  getOverdue(tipo: BusinessTransactionTipo): Observable<PaginatedResponse<BusinessFinance>> {
    return this.http.get<PaginatedResponse<BusinessFinance>>(`${this.apiUrl}/overdue/${tipo}`);
  }

  recalculateTaxes(id: string, payload?: { periodStart?: string; periodEnd?: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${id}/taxes/recalculate`, payload || {});
  }

  getTransactionsPaginated(page: number = 1, limit: number = 10, filters?: Record<string, any>): Observable<PaginatedResponse<BusinessFinance>> {
    const params: Record<string, any> = { page, limit, ...filters };
    return this.getTransactions(params);
  }
}
