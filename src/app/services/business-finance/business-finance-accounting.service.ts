// src/app/services/business-finance/business-finance-accounting.service.ts
// Accounting operations for business finance transactions
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusinessFinance } from '../../models/transaction.model';
import { ApiResponse } from '../../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BusinessFinanceAccountingService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/business-finance`;

  post(id: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.base}/${id}/post`, {});
  }

  reverse(id: string, motivo?: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.base}/${id}/reverse`, { motivo });
  }
}
