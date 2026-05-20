// src/app/models/api-response.model.ts
// Contrato de respuesta del backend Finix — NO modificar sin sincronizar con el backend

export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta: ApiMeta;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta: ApiMeta & { pagination: PaginationMeta };
}

export interface ApiMeta {
  timestamp: string;
  requestId?: string;
  [key: string]: unknown;
}

export interface PaginationMeta {
  type: 'offset' | 'cursor';
  total?: number;
  limit?: number;
  offset?: number;
  nextCursor?: string;
}

export interface ApiError {
  success: false;
  code: string;
  message: string;
  meta?: ApiMeta;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;
