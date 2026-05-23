export type AccountType = 'efectivo' | 'ahorro' | 'corriente' | 'credito' | 'inversion';
export type Currency = 'COP' | 'USD' | 'EUR';

export interface Account {
  id: string;
  userId: string;
  nombre: string;
  tipo: AccountType;
  moneda: Currency;
  balance: number; // Stored in cents, displayed as decimal
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDto {
  nombre: string;
  tipo: AccountType;
  moneda: Currency;
  balance: number;
}

export interface UpdateAccountDto extends Partial<CreateAccountDto> {}
