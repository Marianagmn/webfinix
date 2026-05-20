// src/app/models/category.model.ts
import { TransactionType } from './transaction.model';

export interface Category {
  id: string;
  nombre: string;
  tipo: TransactionType;
  color?: string | null;
  icono?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCategoryDto {
  nombre: string;
  tipo: TransactionType;
  icono?: string;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;
import { ApiResponse } from './transaction.model';

export type CategoryType = 'income' | 'expense' | 'transfer';

export interface Category {
  id: string;
  nombre: string;
  tipo: CategoryType;
  color: string;
  icono: string;
  createdAt: string;
}

export interface CreateCategoryDTO {
  nombre: string;
  tipo: CategoryType;
  color: string;
  icono: string;
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {}

export interface CreateCategoryRequest {
  nombre: string;
  tipo: CategoryType;
  color: string;
  icono: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

export { ApiResponse };
