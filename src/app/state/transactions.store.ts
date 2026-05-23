// src/app/state/transactions.store.ts — Angular Signals store for transactions
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PersonalFinance } from '../models/transaction.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TransactionsStore {
  private readonly http = inject(HttpClient);

  private readonly _transactions = signal<PersonalFinance[]>([]);
  readonly transactions = computed(() => this._transactions());

  private readonly _selectedTransaction = signal<PersonalFinance | null>(null);
  readonly selectedTransaction = computed(() => this._selectedTransaction());

  private readonly _loading = signal(false);
  readonly loading = computed(() => this._loading());

  private readonly _error = signal<string | null>(null);
  readonly error = computed(() => this._error());

  // Computed values for analytics
  readonly totalIncome = computed(() =>
    this._transactions()
      .filter(t => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + t.monto, 0)
  );

  readonly totalExpense = computed(() =>
    this._transactions()
      .filter(t => t.tipo === 'gasto')
      .reduce((sum, t) => sum + t.monto, 0)
  );

  readonly balance = computed(() => this.totalIncome() - this.totalExpense());

  loadTransactions(filters?: Record<string, any>): void {
    this._loading.set(true);
    this._error.set(null);

    this.http
      .get<PaginatedResponse<PersonalFinance[]>>(`${environment.apiUrl}/personal-finance`, {
        withCredentials: true,
        params: filters,
      })
      .subscribe({
        next: (res) => {
          this._transactions.set(res.data);
          this._loading.set(false);
        },
        error: (err) => {
          this._error.set(err.message || 'Error loading transactions');
          this._loading.set(false);
        },
      });
  }

  selectTransaction(transaction: PersonalFinance): void {
    this._selectedTransaction.set(transaction);
  }

  clearSelection(): void {
    this._selectedTransaction.set(null);
  }

  addTransaction(transaction: PersonalFinance): void {
    this._transactions.update(transactions => [transaction, ...transactions]);
  }

  updateTransaction(id: string, updates: Partial<PersonalFinance>): void {
    this._transactions.update(transactions =>
      transactions.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  }

  removeTransaction(id: string): void {
    this._transactions.update(transactions => transactions.filter(t => t.id !== id));
    if (this._selectedTransaction()?.id === id) {
      this._selectedTransaction.set(null);
    }
  }

  clear(): void {
    this._transactions.set([]);
    this._selectedTransaction.set(null);
    this._error.set(null);
    this._loading.set(false);
  }
}
