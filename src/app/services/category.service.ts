import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../models/category.model';
import { ApiResponse, PaginatedResponse } from '../models/transaction.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/categories`;

  getCategories(params?: any): Observable<Category[]> {
    return this.http.get<PaginatedResponse<Category>>(this.base, { params }).pipe(
      map(response => response.data)
    );
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<ApiResponse<Category>>(`${this.base}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createCategory(data: CreateCategoryDto): Observable<Category> {
    return this.http.post<ApiResponse<Category>>(this.base, data).pipe(
      map(response => response.data)
    );
  }

  updateCategory(id: string, data: UpdateCategoryDto): Observable<Category> {
    return this.http.put<ApiResponse<Category>>(`${this.base}/${id}`, data).pipe(
      map(response => response.data)
    );
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`).pipe(
      map(() => undefined)
    );
  }
}
