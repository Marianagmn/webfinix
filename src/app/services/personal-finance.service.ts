import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonalFinance, CreatePersonalFinanceDto, UpdatePersonalFinanceDto, ApiResponse } from '../models/transaction.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonalFinanceService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/personal-finance`;

  getTransactions(): Observable<ApiResponse<PersonalFinance[]>> {
    return this.http.get<ApiResponse<PersonalFinance[]>>(this.base);
  }

  getTransactionById(id: string): Observable<ApiResponse<PersonalFinance>> {
    return this.http.get<ApiResponse<PersonalFinance>>(`${this.base}/${id}`);
  }

  createTransaction(data: CreatePersonalFinanceDto): Observable<ApiResponse<PersonalFinance>> {
    return this.http.post<ApiResponse<PersonalFinance>>(this.base, data);
  }

  updateTransaction(id: string, data: UpdatePersonalFinanceDto): Observable<ApiResponse<PersonalFinance>> {
    return this.http.put<ApiResponse<PersonalFinance>>(`${this.base}/${id}`, data);
  }

  deleteTransaction(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`);
  }

  getAnalysis(): Observable<any> {
    return this.http.get(`${this.base}/analysis`);
  }

  getPrediction(): Observable<any> {
    return this.http.get(`${this.base}/prediction`);
  }

  getSimulation(): Observable<any> {
    return this.http.get(`${this.base}/simulation`);
  }
}
