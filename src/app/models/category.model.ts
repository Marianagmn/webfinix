// src/app/models/category.model.ts — alineado con backend Finix (C-03 D-03)
export type CategoryTipo = 'ingreso' | 'gasto' | 'transferencia'; // en español — backend enum

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

export type UpdateCategoryDto = Partial<CreateCategoryDto>;
