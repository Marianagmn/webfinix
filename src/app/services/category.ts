import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../models/category.model';
import { TransactionType } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/categories`;

  list(tipo?: TransactionType): Observable<ApiResponse<Category[]>> {
    const params = new HttpParams({ fromObject: { tipo: tipo as any } });
    return this.http.get<ApiResponse<Category[]>>(this.base, { params: tipo ? params : undefined });
  }

  get(id: string): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.base}/${id}`);
  }

  create(dto: CreateCategoryDto): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(this.base, dto);
  }

  update(id: string, dto: UpdateCategoryDto): Observable<ApiResponse<Category>> {
    return this.http.patch<ApiResponse<Category>>(`${this.base}/${id}`, dto);
  }

  remove(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }
}
