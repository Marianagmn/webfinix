// src/app/services/business-finance/business-finance-approval.service.ts
// Approval workflow for business finance transactions
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusinessFinance } from '../../models/transaction.model';
import { ApiResponse, PaginatedResponse } from '../../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BusinessFinanceApprovalService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/business-finance`;

  submitForApproval(id: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.base}/${id}/submit`, {});
  }

  approve(id: string, comentario?: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.base}/${id}/approve`, { comentario });
  }

  reject(id: string, motivo?: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.base}/${id}/reject`, { motivo });
  }

  getPendingApprovals(params?: any): Observable<PaginatedResponse<BusinessFinance>> {
    return this.http.get<PaginatedResponse<BusinessFinance>>(`${this.base}/approvals/pending`, { params });
  }
}
