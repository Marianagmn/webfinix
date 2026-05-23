// src/app/models/business-finance.model.ts — alineado con backend Finix (C-03)
import { ApiResponse } from './api-response.model';

export type BusinessTransactionTipo =
  | 'ingreso'
  | 'gasto'
  | 'factura_venta'
  | 'factura_compra'
  | 'nota_credito'
  | 'nota_debito'
  | 'anticipo'
  | 'devolucion';

export type BusinessTransactionEstado =
  | 'borrador'
  | 'pendiente'
  | 'aprobada'
  | 'contabilizada'
  | 'rechazada';

export interface Vencimiento {
  fechaVencimiento?: string | null;
  diasVencimiento?: number | null;
}

export interface Impuesto {
  nombre: string;
  tasa: number;
  monto: number;
}

export interface Pago {
  monto: number;
  fecha: string;
  metodoPago: string;
  referencia?: string;
}

export interface BusinessTransaction {
  id: string;
  tipo: BusinessTransactionTipo;
  numero?: string | null;
  terceroId?: string | null;   // backend usa terceroId, no clienteId
  monto: number;
  moneda: string;
  fecha?: string;
  descripcion?: string | null;
  estado: BusinessTransactionEstado;
  vencimiento?: Vencimiento | null;
  impuestos?: Impuesto[];
  pagos?: Pago[];
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBusinessTransactionDto {
  tipo: BusinessTransactionTipo;
  numero?: string;
  terceroId?: string;
  monto: number;
  moneda?: string;
  descripcion?: string;
  fecha?: string;
  vencimiento?: Vencimiento;
  impuestos?: Impuesto[];
  tags?: string[];
}

export type UpdateBusinessTransactionDto = Partial<CreateBusinessTransactionDto>;

export interface ApplyPaymentDto {
  monto: number;
  fecha?: string;
  metodoPago: string;
  referencia?: string;
}

export type { ApiResponse };
