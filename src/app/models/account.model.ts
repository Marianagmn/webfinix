// src/app/models/account.model.ts — unificado, sin duplicados (C-02 C-03)
export type AccountType = 'efectivo' | 'ahorro' | 'corriente' | 'credito' | 'inversion';
export type Currency = 'COP' | 'USD' | 'EUR';

export interface Account {
  id: string;
  nombre: string;
  tipo: AccountType;
  moneda: Currency;
  balance: number;
  descripcion?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDto {
  nombre: string;
  tipo: AccountType;
  moneda: Currency;
  descripcion?: string;
  balance?: number;
}

export type UpdateAccountDto = Partial<CreateAccountDto>;
