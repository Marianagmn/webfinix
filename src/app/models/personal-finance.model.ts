// src/app/models/personal-finance.model.ts — alineado exactamente con el backend Finix (C-03 D-02)
export type TransactionTipo = 'ingreso' | 'gasto' | 'transferencia';
export type TransactionEstado = 'pendiente' | 'completado' | 'cancelado';
export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia' | 'cheque' | 'otro';

export interface PersonalFinance {
  id: string;
  tipo: TransactionTipo;
  monto: number;
  moneda: string;
  categoria: string | null;        // ObjectId como string (puede estar poblado)
  cuentaOrigenId: string | null;
  cuentaDestinoId: string | null;
  metodoPago: MetodoPago | null;
  descripcion: string | null;
  fecha: string;
  estado: TransactionEstado;
  tags: string[];
  esAhorro: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonalFinanceDto {
  tipo: TransactionTipo;
  monto: number;
  moneda?: string;
  categoriaId?: string;
  cuentaOrigenId?: string;
  cuentaDestinoId?: string;
  metodoPago?: MetodoPago;
  descripcion?: string;
  fecha?: string;
  estado?: TransactionEstado;
  tags?: string[];
  esAhorro?: boolean;
}

export type UpdatePersonalFinanceDto = Partial<CreatePersonalFinanceDto>;

export interface TransactionFilter {
  page?: number;
  perPage?: number;
  from?: string;
  to?: string;
  tipo?: TransactionTipo | TransactionTipo[];
  categoriaId?: string;
  cuentaOrigenId?: string;
  order?: 'asc' | 'desc';
}
