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
