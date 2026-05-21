import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { PersonalFinance, CreatePersonalFinanceRequest, UpdatePersonalFinanceRequest, ApiResponse } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class PersonalFinanceService {
  private readonly http = inject(HttpClient);
  private apiUrl = '/api/personal-finance';

  getTransactions(): Observable<PersonalFinance[]> {
    return this.http.get<ApiResponse<PersonalFinance[]>>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  getTransactionById(id: string): Observable<ApiResponse<PersonalFinance>> {
    return this.http.get<ApiResponse<PersonalFinance>>(`${this.apiUrl}/${id}`);
  }

  createTransaction(data: CreatePersonalFinanceRequest): Observable<ApiResponse<PersonalFinance>> {
    return this.http.post<ApiResponse<PersonalFinance>>(this.apiUrl, data);
  }

  updateTransaction(id: string, data: UpdatePersonalFinanceRequest): Observable<ApiResponse<PersonalFinance>> {
    return this.http.put<ApiResponse<PersonalFinance>>(`${this.apiUrl}/${id}`, data);
  }

  deleteTransaction(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAnalysis(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analysis`);
  }

  getPrediction(): Observable<any> {
    return this.http.get(`${this.apiUrl}/prediction`);
  }

  getSimulation(): Observable<any> {
    return this.http.get(`${this.apiUrl}/simulation`);
  }
}
