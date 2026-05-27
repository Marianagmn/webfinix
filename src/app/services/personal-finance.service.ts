import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    // Aplicar valores por defecto del schema backend
    const defaultFilter: TransactionFilter = {
      page: 1,
      limit: 20,
    };

    const mergedFilter = { ...defaultFilter, ...filter };

    let params = new HttpParams();

    // Agregar parámetros de paginación
    if (mergedFilter.page !== undefined) {
      params = params.set('page', String(mergedFilter.page));
    }
    if (mergedFilter.limit !== undefined) {
      params = params.set('limit', String(mergedFilter.limit));
    }

    // Agregar parámetros de ordenamiento
    if (mergedFilter.sort) {
      params = params.set('sort', mergedFilter.sort);
    }

    // Agregar filtros específicos
    if (mergedFilter.tipo) {
      if (Array.isArray(mergedFilter.tipo)) {
        // Si es array, agregar múltiples valores
        mergedFilter.tipo.forEach(t => params = params.append('tipo', t));
      } else {
        params = params.set('tipo', mergedFilter.tipo);
      }
    }

    if (mergedFilter.estado) {
      params = params.set('estado', mergedFilter.estado);
    }

    if (mergedFilter.fechaDesde) {
      params = params.set('fechaDesde', mergedFilter.fechaDesde);
    }

    if (mergedFilter.fechaHasta) {
      params = params.set('fechaHasta', mergedFilter.fechaHasta);
    }

    if (mergedFilter.cuentaOrigenId) {
      params = params.set('cuentaOrigenId', mergedFilter.cuentaOrigenId);
    }

    if (mergedFilter.categoria) {
      params = params.set('categoria', mergedFilter.categoria);
    }

    if (mergedFilter.search) {
      params = params.set('search', mergedFilter.search);
    }

    return this.http.get<PaginatedResponse<PersonalFinance>>(this.apiUrl, { params }).pipe(
      map(response => {
        // Normalizar _id a id para cada transacción
        if (response.data && Array.isArray(response.data)) {
          response.data = response.data.map(item => ({
            ...item,
            id: item._id || item.id
          }));
        }
        return response;
      })
    );
  }


  getTransactionById(id: string): Observable<PersonalFinance> {
    return this.http.get<ApiResponse<PersonalFinance>>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        // Normalizar _id a id
        const data = response.data;
        return {
          ...data,
          id: data._id || data.id
        };
      })
    );
  }

  createTransaction(dto: CreatePersonalFinanceDto): Observable<PersonalFinance> {
    return this.http.post<ApiResponse<PersonalFinance>>(this.apiUrl, dto).pipe(
      map(response => {
        // Normalizar _id a id
        const data = response.data;
        return {
          ...data,
          id: data._id || data.id
        };
      })
    );
  }

  updateTransaction(id: string, dto: UpdatePersonalFinanceDto): Observable<PersonalFinance> {
    return this.http.put<ApiResponse<PersonalFinance>>(`${this.apiUrl}/${id}`, dto).pipe(
      map(response => {
        // Normalizar _id a id
        const data = response.data;
        return {
          ...data,
          id: data._id || data.id
        };
      })
    );
  }

  deleteTransaction(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined)
    );
  }

  // ── Soft Delete / Restauración ────────────────────────────────────────────

  /**
   * Obtiene las transacciones eliminadas (soft-deleted) del usuario.
   */
  getDeletedTransactions(filter?: TransactionFilter): Observable<PaginatedResponse<PersonalFinance>> {
    let params = new HttpParams();
    params = params.set('page', String(filter?.page || 1));
    params = params.set('limit', String(filter?.limit || 20));

    if (filter?.tipo) {
      const tipoValue = Array.isArray(filter.tipo) ? filter.tipo.join(',') : filter.tipo;
      params = params.set('tipo', tipoValue);
    }
    if (filter?.search) {
      params = params.set('search', filter.search);
    }

    return this.http.get<PaginatedResponse<PersonalFinance>>(`${this.apiUrl}/trash`, { params }).pipe(
      map(response => {
        // Normalizar _id a id para cada transacción
        if (response.data && Array.isArray(response.data)) {
          response.data = response.data.map(item => ({
            ...item,
            id: item._id || item.id
          }));
        }
        return response;
      })
    );
  }

  /**
   * Restaura una transacción eliminada.
   */
  restoreTransaction(id: string): Observable<PersonalFinance> {
    return this.http.put<ApiResponse<PersonalFinance>>(`${this.apiUrl}/${id}/restore`, {}).pipe(
      map(response => {
        // Normalizar _id a id
        const data = response.data;
        return {
          ...data,
          id: data._id || data.id
        };
      })
    );
  }

  /**
   * Elimina permanentemente una transacción.
   * Requiere confirmación explícita.
   */
  permanentlyDeleteTransaction(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}/permanent?confirm=true`).pipe(
      map(() => undefined)
    );
  }

  getAnalysis(): Observable<AnalysisResponse> {
    return this.http.get<ApiResponse<AnalysisResponse>>(`${this.apiUrl}/analysis`).pipe(
      map(response => response.data)
    );
  }

  getPrediction(): Observable<PredictionResponse> {
    return this.http.get<ApiResponse<PredictionResponse>>(`${this.apiUrl}/prediction`).pipe(
      map(response => response.data)
    );
  }

  getSimulation(): Observable<SimulationResponse> {
    return this.http.get<ApiResponse<SimulationResponse>>(`${this.apiUrl}/simulation`).pipe(
      map(response => response.data)
    );
  }
}
