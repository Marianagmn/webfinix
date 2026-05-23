import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusinessFinance, CreateBusinessFinanceDto, UpdateBusinessFinanceDto, ApiResponse } from '../models/transaction.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessFinanceService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/business-finance`;

  getTransactions(): Observable<ApiResponse<BusinessFinance[]>> {
    return this.http.get<ApiResponse<BusinessFinance[]>>(this.base);
  }

  getTransactionById(id: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.get<ApiResponse<BusinessFinance>>(`${this.base}/${id}`);
  }

  createTransaction(data: CreateBusinessFinanceDto): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(this.base, data);
  }

  updateTransaction(id: string, data: UpdateBusinessFinanceDto): Observable<ApiResponse<BusinessFinance>> {
    return this.http.put<ApiResponse<BusinessFinance>>(`${this.base}/${id}`, data);
  }

  deleteTransaction(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }

  submitForApproval(id: string): Observable<any> {
    return this.http.post(`${this.base}/${id}/submit`, {});
  }

  approve(id: string): Observable<any> {
    return this.http.post(`${this.base}/${id}/approve`, {});
  }

  reject(id: string): Observable<any> {
    return this.http.post(`${this.base}/${id}/reject`, {});
  }

  post(id: string): Observable<any> {
    return this.http.post(`${this.base}/${id}/post`, {});
  }

  reverse(id: string): Observable<any> {
    return this.http.post(`${this.base}/${id}/reverse`, {});
  }

  applyPayment(id: string, paymentData: any): Observable<any> {
    return this.http.post(`${this.base}/${id}/payments`, paymentData);
  }

  getPendingApprovals(): Observable<ApiResponse<BusinessFinance[]>> {
    return this.http.get<ApiResponse<BusinessFinance[]>>(`${this.base}/approvals/pending`);
  }

  getOverdue(tipo: 'cobrar' | 'pagar'): Observable<ApiResponse<BusinessFinance[]>> {
    return this.http.get<ApiResponse<BusinessFinance[]>>(`${this.base}/overdue/${tipo}`);
  }
}
