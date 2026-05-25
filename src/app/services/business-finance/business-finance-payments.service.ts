// src/app/services/business-finance/business-finance-payments.service.ts
// Payment operations for business finance transactions
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusinessFinance } from '../../models/transaction.model';
import { ApiResponse, PaginatedResponse } from '../../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BusinessFinancePaymentsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/business-finance`;

  applyPayment(id: string, paymentData: { pagoId: string; monto: number }): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.base}/${id}/payments`, paymentData);
  }

  getOverdue(tipo: 'cobrar' | 'pagar', params?: any): Observable<PaginatedResponse<BusinessFinance>> {
    return this.http.get<PaginatedResponse<BusinessFinance>>(`${this.base}/overdue/${tipo}`, { params });
  }
}
