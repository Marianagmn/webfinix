import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusinessFinance, CreateBusinessFinanceDto, UpdateBusinessFinanceDto } from '../models/business-finance.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BusinessFinanceService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/business-finance`;

  getTransactions(params?: any): Observable<PaginatedResponse<BusinessFinance>> {
    return this.http.get<PaginatedResponse<BusinessFinance>>(this.base, { params });
  }

  /**
   * Obtiene transacciones empresariales con paginación
   * @param page - Número de página (default: 1)
   * @param limit - Límite de items por página (default: 10)
   * @param filters - Filtros opcionales (tipo, estado, fechaDesde, fechaHasta, etc.)
   */
  getTransactionsPaginated(page: number = 1, limit: number = 10, filters?: any): Observable<PaginatedResponse<BusinessFinance>> {
    const params: any = { page, limit, ...filters };
    return this.http.get<PaginatedResponse<BusinessFinance>>(this.base, { params });
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

  deleteTransaction(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`);
  }

  submitForApproval(id: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.base}/${id}/submit`, {});
  }

  approve(id: string, comentario?: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.base}/${id}/approve`, { comentario });
  }

  reject(id: string, motivo?: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.base}/${id}/reject`, { motivo });
  }

  post(id: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.base}/${id}/post`, {});
  }

  reverse(id: string, motivo?: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.base}/${id}/reverse`, { motivo });
  }

  applyPayment(id: string, paymentData: { pagoId: string; monto: number }): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.base}/${id}/payments`, paymentData);
  }

  getPendingApprovals(params?: any): Observable<PaginatedResponse<BusinessFinance>> {
    return this.http.get<PaginatedResponse<BusinessFinance>>(`${this.base}/approvals/pending`, { params });
  }

  getOverdue(tipo: 'cobrar' | 'pagar', params?: any): Observable<PaginatedResponse<BusinessFinance>> {
    return this.http.get<PaginatedResponse<BusinessFinance>>(`${this.base}/overdue/${tipo}`, { params });
  }

  recalculateTaxes(id: string): Observable<ApiResponse<BusinessFinance>> {
    return this.http.post<ApiResponse<BusinessFinance>>(`${this.base}/${id}/taxes/recalculate`, {});
  }
}
