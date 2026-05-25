export type CategoryType = 'ingreso' | 'gasto' | 'transferencia'; // Cambiado a español para coincidir con backend
export type CategoryTipo = CategoryType;

export interface Category {
  id: string;
  userId: string;
  nombre: string;
  tipo: CategoryType;
  color?: string | null;
  icono?: string | null;
  isDefault: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  nombre: string;
  tipo: CategoryTipo;
  color?: string;
  icono?: string;
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDto> {}

export interface CreateCategoryRequest {
  nombre: string;
  tipo: CategoryType;
  color?: string;
  icono?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}
