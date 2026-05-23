export type AccountType = 'efectivo' | 'ahorro' | 'corriente' | 'credito' | 'inversion';
export type Currency = 'COP' | 'USD' | 'EUR';

export interface Account {
  id: string;
  userId: string;
  nombre: string;
  tipo: AccountType;
  moneda: Currency;
  balance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDTO {
  userId?: string; // Se puede inferir del token, opcional en el DTO
  nombre: string;
  tipo: AccountType;
  moneda: Currency;
  balance: number;
}

export interface UpdateAccountDTO extends Partial<CreateAccountDTO> {}
