// src/app/models/transaction.model.ts
import { CategoryType } from './category.model';

export type TransactionTipo = CategoryType;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PersonalFinance {
  id: string;
  userId: string;
  tipo: CategoryType;
  monto: number;
  moneda: string;
  tasaCambio: number;
  categoria: string;
  cuentaOrigenId: string;
  cuentaDestinoId: string;
  metodoPago: string;
  descripcion: string;
  fecha: string;
  estado: string;
  esAhorro: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonalFinanceDTO {
  tipo: CategoryType;
  monto: number;
  moneda?: string;
  tasaCambio?: number;
  categoria: string;
  cuentaOrigenId?: string;
  cuentaDestinoId?: string;
  metodoPago?: string;
  descripcion?: string;
  fecha?: string;
  estado?: string;
  esAhorro?: boolean;
  tags?: string[];
}

export interface UpdatePersonalFinanceDTO extends Partial<CreatePersonalFinanceDTO> {}

export interface CreatePersonalFinanceRequest {
  tipo: CategoryType;
  monto: number;
  moneda?: string;
  tasaCambio?: number;
  categoria?: string;
  cuentaOrigenId?: string;
  cuentaDestinoId?: string;
  metodoPago?: string;
  descripcion?: string;
  fecha?: string;
  estado?: string;
  esAhorro?: boolean;
  tags?: string[];
}

export interface UpdatePersonalFinanceRequest extends Partial<CreatePersonalFinanceRequest> {}

export interface TransactionFilter {
  page?: number;
  perPage?: number;
  from?: string;
  to?: string;
  tipo?: CategoryType | CategoryType[];
  categoriaId?: string;
  cuentaOrigenId?: string;
  order?: 'asc' | 'desc';
}

export type BusinessFinanceStatus = 'borrador' | 'pendiente' | 'aprobada' | 'contabilizada' | 'rechazada';

export interface BusinessFinance {
  id: string;
  businessId: string;
  tipo: 'cobrar' | 'pagar';
  monto: number;
  estado: BusinessFinanceStatus;
  clienteId: string;
  fechaVencimiento: string;
  createdAt: string;
}

export interface CreateBusinessFinanceRequest {
  businessId: string;
  tipo: 'cobrar' | 'pagar';
  monto: number;
  clienteId: string;
  fechaVencimiento: string;
}

export interface UpdateBusinessFinanceRequest extends Partial<CreateBusinessFinanceRequest> {}

export interface CreateBusinessFinanceDTO {
  businessId: string;
  tipo: 'cobrar' | 'pagar';
  monto: number;
  clienteId: string;
  fechaVencimiento: string;
}

export interface UpdateBusinessFinanceDTO extends Partial<CreateBusinessFinanceDTO> {}