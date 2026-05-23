import { ApiResponse } from './transaction.model';

export type CategoryTipo = 'ingreso' | 'gasto' | 'transferencia';

export interface Category {
  id: string;
  nombre: string;
  tipo: CategoryTipo;
  color: string;
  icono: string;
  createdAt: string;
}

export interface CreateCategoryDto {
  nombre: string;
  tipo: CategoryTipo;
  color: string;
  icono: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export interface CreateCategoryRequest {
  nombre: string;
  tipo: CategoryTipo;
  color: string;
  icono: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

export type { ApiResponse };
