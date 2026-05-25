import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import {
  PersonalFinance,
  CreatePersonalFinanceDto,
  UpdatePersonalFinanceDto,
  TransactionFilter,
  AnalysisResponse,
  PredictionResponse,
  SimulationResponse,
} from '../models/personal-finance.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PersonalFinanceService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/personal-finance`;

  getTransactions(filter?: TransactionFilter): Observable<PaginatedResponse<PersonalFinance>> {
    let params = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          params = params.set(k, String(v));
        }
      });
    }
    return this.http.get<PaginatedResponse<PersonalFinance>>(this.apiUrl, { params });
  }


  getTransactionById(id: string): Observable<ApiResponse<PersonalFinance>> {
    return this.http.get<ApiResponse<PersonalFinance>>(`${this.apiUrl}/${id}`);
  }

  createTransaction(dto: CreatePersonalFinanceDto): Observable<ApiResponse<PersonalFinance>> {
    return this.http.post<ApiResponse<PersonalFinance>>(this.apiUrl, dto);
  }

  updateTransaction(id: string, dto: UpdatePersonalFinanceDto): Observable<ApiResponse<PersonalFinance>> {
    return this.http.put<ApiResponse<PersonalFinance>>(`${this.apiUrl}/${id}`, dto);
  }

  deleteTransaction(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  getAnalysis(): Observable<ApiResponse<AnalysisResponse>> {
    return this.http.get<ApiResponse<AnalysisResponse>>(`${this.apiUrl}/analysis`);
  }

  getPrediction(): Observable<ApiResponse<PredictionResponse>> {
    return this.http.get<ApiResponse<PredictionResponse>>(`${this.apiUrl}/prediction`);
  }

  getSimulation(): Observable<ApiResponse<SimulationResponse>> {
    return this.http.get<ApiResponse<SimulationResponse>>(`${this.apiUrl}/simulation`);
  }
}
