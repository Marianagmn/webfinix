// src/app/models/api-response.model.ts
// Contrato de respuesta del backend Finix — Fuente única de verdad
// NO modificar sin sincronizar con el backend

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: ApiMeta;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface ApiMeta {
  timestamp?: string;
  requestId?: string;
  [key: string]: unknown;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  code: string;
  message: string;
  meta?: ApiMeta;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;
