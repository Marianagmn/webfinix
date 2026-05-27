import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  Business, 
  CreateBusinessDto, 
  UpdateBusinessDto, 
  BusinessListParams,
  ApiResponse 
} from '../models/business.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BusinessService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/business`;

  /**
   * Crea un nuevo negocio
   * POST /api/business
   */
  create(data: CreateBusinessDto): Observable<Business> {
    return this.http.post<ApiResponse<Business>>(`${this.base}`, data).pipe(
      map(response => {
        const data = response.data as any;
        // Normalize _id to id
        return {
          ...data,
          id: data._id || data.id
        };
      })
    );
  }

  /**
   * Lista todos los negocios con filtros y paginación
   * GET /api/business
   * Query params: estado, tipoEmpresa, sector, regimenTributario, page, limit, sort
   */
  list(params?: any): Observable<{ items: Business[]; total: number; meta: any }> {
    return this.http.get<any>(`${this.base}`, { params }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Lista negocios activos (para selectores en el frontend)
   * GET /api/business/active
   */
  listActive(): Observable<Business[]> {
    return this.http.get<ApiResponse<Business[]>>(`${this.base}/active`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Obtiene un negocio por ID
   * GET /api/business/:id
   */
  getOne(id: string): Observable<Business> {
    return this.http.get<ApiResponse<Business>>(`${this.base}/${id}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Busca un negocio por NIT
   * GET /api/business/nit/:nit
   */
  findByNit(nit: string): Observable<Business> {
    return this.http.get<ApiResponse<Business>>(`${this.base}/nit/${nit}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Actualiza un negocio
   * PUT /api/business/:id
   */
  update(id: string, data: UpdateBusinessDto): Observable<Business> {
    return this.http.put<ApiResponse<Business>>(`${this.base}/${id}`, data).pipe(
      map(response => response.data)
    );
  }

  /**
   * Soft-delete de un negocio
   * DELETE /api/business/:id
   */
  delete(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`).pipe(
      map(() => undefined)
    );
  }
}
