import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonalFinance, CreatePersonalFinanceDTO, UpdatePersonalFinanceDTO } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class PersonalFinanceService {
  private http = inject(HttpClient);
  private apiUrl = '/api/personal-finance';

  getTransactions(): Observable<PersonalFinance[]> {
    return this.http.get<PersonalFinance[]>(this.apiUrl);
  }

  getTransactionById(id: string): Observable<PersonalFinance> {
    return this.http.get<PersonalFinance>(`${this.apiUrl}/${id}`);
  }

  createTransaction(data: CreatePersonalFinanceDTO): Observable<PersonalFinance> {
    return this.http.post<PersonalFinance>(this.apiUrl, data);
  }

  updateTransaction(id: string, data: UpdatePersonalFinanceDTO): Observable<PersonalFinance> {
    return this.http.put<PersonalFinance>(`${this.apiUrl}/${id}`, data);
  }

  deleteTransaction(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAnalysis(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/analysis`);
  }

  getPrediction(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/prediction`);
  }

  getSimulation(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/simulation`);
  }
}
