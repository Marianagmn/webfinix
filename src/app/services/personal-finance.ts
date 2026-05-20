import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { Transaction, CreateTransactionDto, UpdateTransactionDto, TransactionFilter } from '../models/transaction.model';
import { AnalysisData, PredictionData, SimulationData } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class PersonalFinanceService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/personal-finance`;

  list(filter?: TransactionFilter): Observable<PaginatedResponse<Transaction[]>> {
    let params = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([k, v]) => {
        if (v !== undefined && v !== null) params = params.set(k, String(v));
      });
    }
    return this.http.get<PaginatedResponse<Transaction[]>>(`${this.base}/transactions`, { params });
  }

  get(id: string): Observable<ApiResponse<Transaction>> {
    return this.http.get<ApiResponse<Transaction>>(`${this.base}/transactions/${id}`);
  }

  create(dto: CreateTransactionDto): Observable<ApiResponse<Transaction>> {
    return this.http.post<ApiResponse<Transaction>>(`${this.base}/transactions`, dto);
  }

  update(id: string, dto: UpdateTransactionDto): Observable<ApiResponse<Transaction>> {
    return this.http.patch<ApiResponse<Transaction>>(`${this.base}/transactions/${id}`, dto);
  }

  remove(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/transactions/${id}`);
  }

  analysis(): Observable<ApiResponse<AnalysisData>> {
    return this.http.get<ApiResponse<AnalysisData>>(`${this.base}/analytics/analysis`);
  }

  predict(): Observable<ApiResponse<PredictionData>> {
    return this.http.get<ApiResponse<PredictionData>>(`${this.base}/analytics/prediction`);
  }

  simulate(): Observable<ApiResponse<SimulationData>> {
    return this.http.get<ApiResponse<SimulationData>>(`${this.base}/analytics/simulate`);
  }
}
