import { ApiResponse } from './api-response.model';

export type CategoryTipo = 'ingreso' | 'gasto' | 'transferencia';

export interface Category {
  id: string;
  userId: string;
  nombre: string;
  tipo: CategoryTipo;
  color: string;
  icono: string;
  isDefault: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  nombre: string;
  tipo: CategoryTipo;
  color: string;
  icono: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export type { ApiResponse };
