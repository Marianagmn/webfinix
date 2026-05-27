// src/app/models/personal-finance.model.ts — alineado exactamente con el backend Finix (C-03 D-02)
export type TransactionTipo = 'ingreso' | 'gasto' | 'transferencia';
export type TransactionEstado = 'pendiente' | 'completado' | 'cancelado';
export type MetodoPago = 'efectivo' | 'transferencia' | 'tarjeta de credito' | 'tarjeta debito' | 'cheque' | 'otro';

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
  categoria?: string;
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
  limit?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  tipo?: TransactionTipo | TransactionTipo[];
  categoria?: string;
  cuentaOrigenId?: string;
  sort?: string;
  estado?: TransactionEstado;
  search?: string;
}

// Interfaces para respuestas de análisis/predicción/simulación (MED-19)
export interface AnalysisResponse {
  totalIngresos: number;
  totalGastos: number;
  balance: number;
  gastosPorCategoria: Array<{ categoria: string; monto: number; porcentaje: number }>;
  tendencias: Array<{ mes: string; ingresos: number; gastos: number }>;
  proyeccion: { mes: string; montoEstimado: number }[];
}

export interface PredictionResponse {
  predicciones: Array<{
    fecha: string;
    tipo: TransactionTipo;
    montoEstimado: number;
    confianza: number;
  }>;
  resumen: {
    totalEstimado: number;
    tendencia: 'creciente' | 'decreciente' | 'estable';
  };
}

export interface SimulationResponse {
  escenarios: Array<{
    nombre: string;
    descripcion: string;
    resultado: {
      balanceFinal: number;
      ahorro: number;
      mesesParaMeta?: number;
    };
  }>;
  parametros: {
    ingresoMensual: number;
    gastoMensual: number;
    tasaAhorro: number;
  };
}
