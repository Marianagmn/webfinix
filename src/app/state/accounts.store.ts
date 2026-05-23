// src/app/state/accounts.store.ts — Angular Signals store for accounts
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/account.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountsStore {
  private readonly http = inject(HttpClient);

  private readonly _accounts = signal<Account[]>([]);
  readonly accounts = computed(() => this._accounts());

  private readonly _selectedAccount = signal<Account | null>(null);
  readonly selectedAccount = computed(() => this._selectedAccount());

  private readonly _loading = signal(false);
  readonly loading = computed(() => this._loading());

  private readonly _error = signal<string | null>(null);
  readonly error = computed(() => this._error());

  loadAccounts(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http
      .get<PaginatedResponse<Account[]>>(`${environment.apiUrl}/accounts`, { withCredentials: true })
      .subscribe({
        next: (res) => {
          this._accounts.set(res.data);
          this._loading.set(false);
        },
        error: (err) => {
          this._error.set(err.message || 'Error loading accounts');
          this._loading.set(false);
        },
      });
  }

  selectAccount(account: Account): void {
    this._selectedAccount.set(account);
  }

  clearSelection(): void {
    this._selectedAccount.set(null);
  }

  addAccount(account: Account): void {
    this._accounts.update(accounts => [...accounts, account]);
  }

  updateAccount(id: string, updates: Partial<Account>): void {
    this._accounts.update(accounts =>
      accounts.map(acc => (acc.id === id ? { ...acc, ...updates } : acc))
    );
  }

  removeAccount(id: string): void {
    this._accounts.update(accounts => accounts.filter(acc => acc.id !== id));
    if (this._selectedAccount()?.id === id) {
      this._selectedAccount.set(null);
    }
  }

  clear(): void {
    this._accounts.set([]);
    this._selectedAccount.set(null);
    this._error.set(null);
    this._loading.set(false);
  }
}
