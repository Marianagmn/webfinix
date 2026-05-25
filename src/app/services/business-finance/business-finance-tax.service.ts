// src/app/services/business-finance/business-finance-tax.service.ts
// Tax calculation operations for business finance transactions
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusinessFinance } from '../../models/transaction.model';
import { ApiResponse } from '../../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BusinessFinanceTaxService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/business-finance`;

  recalculateTaxes(id: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.base}/${id}/taxes/recalculate`, {});
  }
}
