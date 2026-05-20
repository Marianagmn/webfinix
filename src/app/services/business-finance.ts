import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { BusinessTransaction, CreateBusinessTransactionDto, UpdateBusinessTransactionDto } from '../models/business-finance.model';

@Injectable({ providedIn: 'root' })
export class BusinessFinanceService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/business-finance`;

  list(paramsObj?: Record<string, any>): Observable<PaginatedResponse<BusinessTransaction[]>> {
    let params = new HttpParams();
    if (paramsObj) Object.entries(paramsObj).forEach(([k, v]) => (params = params.set(k, String(v))));
    return this.http.get<PaginatedResponse<BusinessTransaction[]>>(`${this.base}/transactions`, { params });
  }

  get(id: string): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.get<ApiResponse<BusinessTransaction>>(`${this.base}/transactions/${id}`);
  }

  create(dto: CreateBusinessTransactionDto): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.post<ApiResponse<BusinessTransaction>>(`${this.base}/transactions`, dto);
  }

  update(id: string, dto: UpdateBusinessTransactionDto): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.patch<ApiResponse<BusinessTransaction>>(`${this.base}/transactions/${id}`, dto);
  }

  remove(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/transactions/${id}`);
  }

  overdue(tipo: string): Observable<ApiResponse<BusinessTransaction[]>> {
    return this.http.get<ApiResponse<BusinessTransaction[]>>(`${this.base}/overdue/${tipo}`);
  }
}
