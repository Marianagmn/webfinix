// src/app/models/transaction.model.ts
// Re-exporta desde personal-finance.model.ts para compatibilidad con componentes existentes
export type {
  TransactionTipo,
  TransactionEstado,
  MetodoPago,
  PersonalFinance,
  CreatePersonalFinanceDto,
  UpdatePersonalFinanceDto,
  TransactionFilter,
} from './personal-finance.model';
