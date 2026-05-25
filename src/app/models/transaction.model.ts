// src/app/models/transaction.model.ts
import { CategoryType } from './category.model';
import { ApiResponse, PaginatedResponse } from './api-response.model';
import {
  PersonalFinance,
  CreatePersonalFinanceDto,
  UpdatePersonalFinanceDto,
  TransactionFilter,
  MetodoPago,
} from './personal-finance.model';
import {
  BusinessFinance,
  CreateBusinessFinanceDto,
  UpdateBusinessFinanceDto,
} from './business-finance.model';

export type TransactionTipo = CategoryType;

export type { ApiResponse, PaginatedResponse };
export type {
  PersonalFinance,
  CreatePersonalFinanceDto,
  UpdatePersonalFinanceDto,
  TransactionFilter,
  MetodoPago,
  BusinessFinance,
  CreateBusinessFinanceDto,
  UpdateBusinessFinanceDto,
};
