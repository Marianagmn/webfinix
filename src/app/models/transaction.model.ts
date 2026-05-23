import { CategoryTipo } from './category.model';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PersonalFinance {
  id: string;
  userId: string;
  tipo: CategoryTipo;
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

export interface CreatePersonalFinanceDto {
  tipo: CategoryTipo;
  monto: number;
  moneda?: string;
  tasaCambio?: number;
  categoria: string;
  cuentaOrigenId?: string;
  cuentaDestinoId?: string;
  metodoPago?: string;
  descripcion: string;
  fecha?: string;
  estado?: string;
  esAhorro?: boolean;
  tags?: string[];
}

export interface UpdatePersonalFinanceDto extends Partial<CreatePersonalFinanceDto> {}

export interface CreatePersonalFinanceRequest {
  tipo: CategoryTipo;
  monto: number;
  moneda?: string;
  tasaCambio?: number;
  categoria: string;
  cuentaOrigenId?: string;
  cuentaDestinoId?: string;
  metodoPago?: string;
  descripcion: string;
  fecha?: string;
  estado?: string;
  esAhorro?: boolean;
  tags?: string[];
}

export interface UpdatePersonalFinanceRequest extends Partial<CreatePersonalFinanceRequest> {}

export type BusinessFinanceStatus = 'borrador' | 'pendiente' | 'aprobada' | 'contabilizada' | 'rechazada';

export interface BusinessFinance {
  id: string;
  businessId: string; // Agregado para coincidir con backend
  tipo: 'cobrar' | 'pagar';
  monto: number;
  estado: BusinessFinanceStatus;
  clienteId: string;
  fechaVencimiento: string;
  createdAt: string;
}

export interface CreateBusinessFinanceDto {
  businessId: string; // Agregado para coincidir con backend
  tipo: 'cobrar' | 'pagar';
  monto: number;
  clienteId: string;
  fechaVencimiento: string;
}

export interface UpdateBusinessFinanceDto extends Partial<CreateBusinessFinanceDto> {}
