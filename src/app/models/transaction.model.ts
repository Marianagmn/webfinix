import { CategoryType } from './category.model';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PersonalFinance {
  id: string;
  userId: string;
  tipo: CategoryType; // Cambiado de 'type' a 'tipo' para coincidir con backend
  monto: number; // Cambiado de 'amount' a 'monto'
  moneda: string;
  tasaCambio: number;
  categoria: string; // Cambiado de 'categoryId' a 'categoria' (ObjectId en backend)
  cuentaOrigenId: string; // Cambiado de 'accountId' a 'cuentaOrigenId'
  cuentaDestinoId: string;
  metodoPago: string;
  descripcion: string;
  fecha: string; // Cambiado de 'date' a 'fecha'
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
  descripcion: string;
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

export interface CreateBusinessFinanceRequest {
  businessId: string; // Agregado para coincidir con backend
  tipo: 'cobrar' | 'pagar';
  monto: number;
  clienteId: string;
  fechaVencimiento: string;
}

export interface UpdateBusinessFinanceRequest extends Partial<CreateBusinessFinanceRequest> {}

export interface CreateBusinessFinanceDTO {
  businessId: string; // Agregado para coincidir con backend
  tipo: 'cobrar' | 'pagar';
  monto: number;
  clienteId: string;
  fechaVencimiento: string;
}

export interface UpdateBusinessFinanceDTO extends Partial<CreateBusinessFinanceDTO> {}
