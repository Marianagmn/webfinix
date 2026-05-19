import { CategoryType } from './category.model';

export interface PersonalFinance {
  id: string;
  amount: number;
  type: CategoryType;
  categoryId: string;
  accountId: string;
  date: string;
  description: string;
  tags: string[];
  isRecurring: boolean;
  createdAt: string;
}

export interface CreatePersonalFinanceDTO {
  amount: number;
  type: CategoryType;
  categoryId: string;
  accountId: string;
  date: string;
  description: string;
  tags: string[];
  isRecurring: boolean;
}

export interface UpdatePersonalFinanceDTO extends Partial<CreatePersonalFinanceDTO> {}

export type BusinessFinanceStatus = 'borrador' | 'pendiente' | 'aprobada' | 'contabilizada' | 'rechazada';

export interface BusinessFinance {
  id: string;
  tipo: 'cobrar' | 'pagar';
  monto: number;
  estado: BusinessFinanceStatus;
  clienteId: string;
  fechaVencimiento: string;
  createdAt: string;
}

export interface CreateBusinessFinanceDTO {
  tipo: 'cobrar' | 'pagar';
  monto: number;
  clienteId: string;
  fechaVencimiento: string;
}

export interface UpdateBusinessFinanceDTO extends Partial<CreateBusinessFinanceDTO> {}
