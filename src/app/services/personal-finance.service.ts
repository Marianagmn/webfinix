// src/app/services/personal-finance.service.ts — C-02: usa environment + modelos correctos + paginación
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import {
  PersonalFinance,
  CreatePersonalFinanceDto,
  UpdatePersonalFinanceDto,
  TransactionFilter,
} from '../models/personal-finance.model';
import { AnalysisData, PredictionData, SimulationData } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class PersonalFinanceService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/personal-finance`;

  // M-06: soporte de paginación y filtros (filter opcional)
  getTransactions(filter?: TransactionFilter): Observable<PaginatedResponse<PersonalFinance[]>> {
    let params = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([k, v]) => {
        if (v !== undefined && v !== null) params = params.set(k, String(v));
      });
    }
    return this.http.get<PaginatedResponse<PersonalFinance[]>>(this.base, { params });
  }

  getTransactionById(id: string): Observable<ApiResponse<PersonalFinance>> {
    return this.http.get<ApiResponse<PersonalFinance>>(`${this.base}/${id}`);
  }

  createTransaction(dto: CreatePersonalFinanceDto): Observable<ApiResponse<PersonalFinance>> {
    return this.http.post<ApiResponse<PersonalFinance>>(this.base, dto);
  }

  // backend usa PATCH para updates parciales
  updateTransaction(id: string, dto: UpdatePersonalFinanceDto): Observable<ApiResponse<PersonalFinance>> {
    return this.http.patch<ApiResponse<PersonalFinance>>(`${this.base}/${id}`, dto);
  }

  deleteTransaction(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }

  getAnalysis(): Observable<ApiResponse<AnalysisData>> {
    return this.http.get<ApiResponse<AnalysisData>>(`${this.base}/analysis`);
  }

  getPrediction(): Observable<ApiResponse<PredictionData>> {
    return this.http.get<ApiResponse<PredictionData>>(`${this.base}/prediction`);
  }

  getSimulation(): Observable<ApiResponse<SimulationData>> {
    return this.http.get<ApiResponse<SimulationData>>(`${this.base}/simulation`);
  }
}
