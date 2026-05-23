import { ApiResponse } from './transaction.model';

export type CategoryType = 'ingreso' | 'gasto' | 'transferencia'; // Cambiado a español para coincidir con backend

export interface Category {
  id: string;
  nombre: string;
  tipo: CategoryTipo;
  color?: string | null;
  icono?: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  nombre: string;
  tipo: CategoryTipo;
  color?: string;
  icono?: string;
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {}

export interface CreateCategoryRequest {
  nombre: string;
  tipo: CategoryType;
  color: string;
  icono: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

export type { ApiResponse };
