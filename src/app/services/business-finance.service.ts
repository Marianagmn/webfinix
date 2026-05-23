// src/app/services/business-finance.service.ts — C-02, B-03: tipos correctos, environment
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusinessFinance, CreateBusinessFinanceRequest, UpdateBusinessFinanceRequest, ApiResponse } from '../models/transaction.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BusinessFinanceService {
  private apiUrl = `${environment.apiUrl}/business-finance`;

  getTransactions(filter?: Record<string, any>): Observable<PaginatedResponse<BusinessTransaction[]>> {
    let params = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([k, v]) => {
        if (v !== undefined && v !== null) params = params.set(k, String(v));
      });
    }
    return this.http.get<PaginatedResponse<BusinessTransaction[]>>(this.base, { params });
  }

  getTransactionById(id: string): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.get<ApiResponse<BusinessTransaction>>(`${this.base}/${id}`);
  }

  createTransaction(dto: CreateBusinessTransactionDto): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.post<ApiResponse<BusinessTransaction>>(this.base, dto);
  }

  updateTransaction(id: string, dto: UpdateBusinessTransactionDto): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.patch<ApiResponse<BusinessTransaction>>(`${this.base}/${id}`, dto);
  }

  deleteTransaction(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }

  // B-03: tipado correcto en lugar de Observable<any>
  submitForApproval(id: string): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.post<ApiResponse<BusinessTransaction>>(`${this.base}/${id}/submit`, {});
  }

  approve(id: string): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.post<ApiResponse<BusinessTransaction>>(`${this.base}/${id}/approve`, {});
  }

  reject(id: string, motivo?: string): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.post<ApiResponse<BusinessTransaction>>(`${this.base}/${id}/reject`, { motivo });
  }

  post(id: string): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.post<ApiResponse<BusinessTransaction>>(`${this.base}/${id}/post`, {});
  }

  reverse(id: string): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.post<ApiResponse<BusinessTransaction>>(`${this.base}/${id}/reverse`, {});
  }

  applyPayment(id: string, dto: ApplyPaymentDto): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.post<ApiResponse<BusinessTransaction>>(`${this.base}/${id}/payments`, dto);
  }

  getPendingApprovals(): Observable<PaginatedResponse<BusinessTransaction[]>> {
    return this.http.get<PaginatedResponse<BusinessTransaction[]>>(`${this.base}/approvals/pending`);
  }

  getOverdue(tipo: BusinessTransactionTipo): Observable<PaginatedResponse<BusinessTransaction[]>> {
    return this.http.get<PaginatedResponse<BusinessTransaction[]>>(`${this.base}/overdue/${tipo}`);
  }

  recalculateTaxes(id: string): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.post<ApiResponse<BusinessTransaction>>(`${this.base}/${id}/taxes/recalculate`, {});
  }
}
