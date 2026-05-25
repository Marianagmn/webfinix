// src/app/services/category.service.ts — C-02: usa environment + modelos correctos
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category, CategoryType, CreateCategoryRequest, UpdateCategoryRequest } from '../models/category.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/categories`;

  private normalizeId<T extends { id?: string; _id?: string }>(item: T): T & { id: string } {
    return {
      ...item,
      id: item.id ?? (item as any)._id ?? '',
    } as T & { id: string };
  }

  getCategories(tipo?: CategoryType): Observable<Category[]> {
    let params = new HttpParams();
    if (tipo) {
      params = params.set('tipo', tipo);
    }
    return this.http.get<ApiResponse<Category[]>>(this.apiUrl, { params }).pipe(
      map((response) => response.data.map((category) => this.normalizeId(category)))
    );
  }

  getCategoryById(id: string): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => ({
        ...response,
        data: this.normalizeId(response.data),
      }))
    );
  }

  createCategory(dto: CreateCategoryRequest): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(this.apiUrl, dto);
  }

  updateCategory(id: string, dto: UpdateCategoryRequest): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/${id}`, dto);
  }

  deleteCategory(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
