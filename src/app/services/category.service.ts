import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../models/category.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/categories`;
  private cache$ = new Map<string, Observable<Category[]>>();
  private invalidateCache$ = new Subject<void>();

  getCategories(tipo?: 'ingreso' | 'gasto' | 'transferencia'): Observable<Category[]> {
    const cacheKey = tipo || 'all';
    
    if (!this.cache$.has(cacheKey)) {
      const params = tipo ? { tipo } : undefined;
      const obs$ = this.http.get<ApiResponse<Category[]>>(this.base, { params }).pipe(
        map(response => response.data),
        shareReplay(1),
        tap(() => {
          this.invalidateCache$.next();
        })
      );
      this.cache$.set(cacheKey, obs$);
    }
    
    return this.cache$.get(cacheKey)!;
  }

  invalidateCache(tipo?: string): void {
    const cacheKey = tipo || 'all';
    this.cache$.delete(cacheKey);
  }

  invalidateAllCache(): void {
    this.cache$.clear();
    this.invalidateCache$.next();
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<ApiResponse<Category>>(`${this.base}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createCategory(data: CreateCategoryDto): Observable<Category> {
    this.invalidateAllCache();
    return this.http.post<ApiResponse<Category>>(this.base, data).pipe(
      map(response => response.data)
    );
  }

  updateCategory(id: string, data: UpdateCategoryDto): Observable<Category> {
    this.invalidateAllCache();
    return this.http.put<ApiResponse<Category>>(`${this.base}/${id}`, data).pipe(
      map(response => response.data)
    );
  }

  deleteCategory(id: string): Observable<void> {
    this.invalidateAllCache();
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`).pipe(
      map(() => undefined)
    );
  }
}
