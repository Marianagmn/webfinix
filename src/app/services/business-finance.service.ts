import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusinessFinance, CreateBusinessFinanceRequest, UpdateBusinessFinanceRequest, ApiResponse } from '../models/transaction.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessFinanceService {
  private apiUrl = `${environment.apiUrl}/business-finance`;

  constructor(private http: HttpClient) { }

  getTransactions(): Observable<ApiResponse<BusinessFinance[]>> {
    return this.http.get<ApiResponse<BusinessFinance[]>>(this.apiUrl);
  }

  getTransactionById(id: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.get<ApiResponse<BusinessFinance>>(`${this.apiUrl}/${id}`);
  }

  createTransaction(data: CreateBusinessFinanceRequest): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(this.apiUrl, data);
  }

  updateTransaction(id: string, data: UpdateBusinessFinanceRequest): Observable<ApiResponse<BusinessFinance>> {
    return this.http.put<ApiResponse<BusinessFinance>>(`${this.apiUrl}/${id}`, data);
  }

  deleteTransaction(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  submitForApproval(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/submit`, {});
  }

  approve(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve`, {});
  }

  reject(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reject`, {});
  }

  post(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/post`, {});
  }

  reverse(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reverse`, {});
  }

  applyPayment(id: string, paymentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/payments`, paymentData);
  }

  getPendingApprovals(): Observable<ApiResponse<BusinessFinance[]>> {
    return this.http.get<ApiResponse<BusinessFinance[]>>(`${this.apiUrl}/approvals/pending`);
  }

  getOverdue(tipo: 'cobrar' | 'pagar'): Observable<ApiResponse<BusinessFinance[]>> {
    return this.http.get<ApiResponse<BusinessFinance[]>>(`${this.apiUrl}/overdue/${tipo}`);
  }
}
