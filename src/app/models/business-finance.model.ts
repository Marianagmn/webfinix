// src/app/models/business-finance.model.ts

export type BusinessTransactionType =
  | 'ingreso'
  | 'gasto'
  | 'transferencia'
  | 'factura'
  | 'anticipo'
  | 'devolucion';

export type BusinessTransactionStatus =
  | 'borrador'
  | 'pendiente_aprobacion'
  | 'aprobado'
  | 'pagado'
  | 'revertido'
  | 'anulado'
  | 'en_disputa';

export interface BusinessTransaction {
  id: string;
  tipo: BusinessTransactionType;
  numero?: string | null;
  tercero?: string | null;
  monto: number;
  moneda?: string;
  fecha?: string;
  descripcion?: string | null;
  status: BusinessTransactionStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBusinessTransactionDto {
  tipo: BusinessTransactionType;
  numero?: string;
  tercero?: string;
  monto: number;
  moneda?: string;
  descripcion?: string;
  fecha?: string;
}

export type UpdateBusinessTransactionDto = Partial<CreateBusinessTransactionDto>;
