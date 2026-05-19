import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusinessFinance, CreateBusinessFinanceDTO, UpdateBusinessFinanceDTO } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessFinanceService {
  private http = inject(HttpClient);
  private apiUrl = '/api/business-finance';

  getTransactions(): Observable<BusinessFinance[]> {
    return this.http.get<BusinessFinance[]>(this.apiUrl);
  }

  getTransactionById(id: string): Observable<BusinessFinance> {
    return this.http.get<BusinessFinance>(`${this.apiUrl}/${id}`);
  }

  createTransaction(data: CreateBusinessFinanceDTO): Observable<BusinessFinance> {
    return this.http.post<BusinessFinance>(this.apiUrl, data);
  }

  updateTransaction(id: string, data: UpdateBusinessFinanceDTO): Observable<BusinessFinance> {
    return this.http.put<BusinessFinance>(`${this.apiUrl}/${id}`, data);
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

  applyPayments(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/payments`, {});
  }

  getPendingApprovals(): Observable<BusinessFinance[]> {
    return this.http.get<BusinessFinance[]>(`${this.apiUrl}/approvals/pending`);
  }
}
