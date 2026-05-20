// src/app/models/account.model.ts
export type AccountType = 'efectivo' | 'ahorro' | 'corriente' | 'credito' | 'inversion';
export type Currency = 'COP' | 'USD' | 'EUR';

export interface Account {
  id: string;
  nombre: string;
  tipo: AccountType;
  moneda: Currency;
  balance: number;
  descripcion?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAccountDto {
  nombre: string;
  tipo: AccountType;
  moneda: Currency;
  descripcion?: string;
  balance?: number;
}

export type UpdateAccountDto = Partial<CreateAccountDto>;
export type AccountType = 'efectivo' | 'ahorro' | 'corriente' | 'credito' | 'inversion';
export type Currency = 'COP' | 'USD' | 'EUR';

export interface Account {
  id: string;
  nombre: string;
  tipo: AccountType;
  moneda: Currency;
  balance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDTO {
  nombre: string;
  tipo: AccountType;
  moneda: Currency;
  balance: number;
}

export interface UpdateAccountDTO extends Partial<CreateAccountDTO> {}
