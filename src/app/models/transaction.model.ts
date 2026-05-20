// src/app/models/transaction.model.ts
import { Category } from './category.model';

export type TransactionType = 'ingreso' | 'gasto' | 'transferencia';
export type TransactionStatus = 'pendiente' | 'completado' | 'cancelado';
export type PaymentMethod =
  | 'efectivo'
  | 'tarjeta'
  | 'transferencia'
  | 'cheque'
  | 'otro';

export interface Transaction {
  id: string;
  tipo: TransactionType;
  monto: number;
  moneda?: string;
  categoria?: Category | string | null;
  cuentaId?: string | null;
  descripcion?: string | null;
  fecha: string;
  status: TransactionStatus;
  metodoPago?: PaymentMethod | null;
  tags?: string[];
  aiMetadata?: TransactionAiMetadata | null;
  createdAt: string;
  updatedAt?: string;
}

export interface TransactionAiMetadata {
  clasificacion?: {
    probableCategory?: string;
    confidence?: number;
    notes?: string;
  };
}

export interface CreateTransactionDto {
  tipo: TransactionType;
  monto: number;
  moneda?: string;
  categoriaId?: string;
  cuentaId?: string;
  descripcion?: string;
  fecha?: string;
  metodoPago?: PaymentMethod;
  tags?: string[];
}

export type UpdateTransactionDto = Partial<CreateTransactionDto>;

export interface TransactionFilter {
  page?: number;
  perPage?: number;
  from?: string;
  to?: string;
  tipo?: TransactionType | TransactionType[];
  categoriaId?: string;
  cuentaId?: string;
  order?: 'asc' | 'desc';
}
import { CategoryType } from './category.model';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

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

export interface CreatePersonalFinanceRequest {
  amount: number;
  type: CategoryType;
  categoryId: string;
  accountId: string;
  date: string;
  description: string;
  tags: string[];
  isRecurring: boolean;
}

export interface UpdatePersonalFinanceRequest extends Partial<CreatePersonalFinanceRequest> {}

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

export interface CreateBusinessFinanceRequest {
  tipo: 'cobrar' | 'pagar';
  monto: number;
  clienteId: string;
  fechaVencimiento: string;
}

export interface UpdateBusinessFinanceRequest extends Partial<CreateBusinessFinanceRequest> {}

export interface CreateBusinessFinanceDTO {
  tipo: 'cobrar' | 'pagar';
  monto: number;
  clienteId: string;
  fechaVencimiento: string;
}

export interface UpdateBusinessFinanceDTO extends Partial<CreateBusinessFinanceDTO> {}
