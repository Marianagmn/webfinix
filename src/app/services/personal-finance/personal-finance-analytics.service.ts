// src/app/services/personal-finance/personal-finance-analytics.service.ts
// AI/Analytics operations for personal finance transactions
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PersonalFinanceAnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/personal-finance`;

  getAnalysis(fechaDesde?: string, fechaHasta?: string): Observable<ApiResponse<any>> {
    const params: any = {};
    if (fechaDesde) params.fechaDesde = fechaDesde;
    if (fechaHasta) params.fechaHasta = fechaHasta;
    return this.http.get<ApiResponse<any>>(`${this.base}/analysis`, { params });
  }

  getPrediction(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.base}/prediction`);
  }

  getSimulation(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.base}/simulation`);
  }
}
