// src/app/models/analytics.model.ts

export interface AnalysisData {
  totalIngresos: number;
  totalGastos: number;
  neto: number;
  tendencia: 'positiva' | 'negativa' | 'estable';
}

export interface CategorySummary {
  categoria: string;
  monto: number;
  count: number;
}

export interface MonthlySummary {
  mes: string;
  ingresos: number;
  gastos: number;
  balance: number;
}

export interface PredictionData {
  gastoEstimadoProximoMes: number;
  confianza: number; // 0..1
}

export interface SimulationData {
  escenarios: SimulationScenario[];
}

export interface SimulationScenario {
  nombre: string;
  descripcion?: string;
  balanceFinal: number;
}
