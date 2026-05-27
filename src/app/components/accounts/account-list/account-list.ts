import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/account.model';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './account-list.html',
  styleUrl: './account-list.css',
})
export class AccountList implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly accounts = signal<Account[]>([]);
  readonly isLoading = signal(false);
  readonly confirmDeleteId = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly totalItems = signal(0);

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.isLoading.set(true);
    this.accountService
      .getAccounts(this.currentPage(), 20)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (accounts: Account[]) => {
          this.accounts.set(accounts ?? []);
          this.totalItems.set(accounts.length);
          this.totalPages.set(Math.ceil(accounts.length / 20));
        },
        error: (err) => {
          this.errorHandler.handleHttpError(err, 'AccountList - load accounts');
        },
      });
  }

  requestDelete(id: string) { this.confirmDeleteId.set(id); }
  cancelDelete() { this.confirmDeleteId.set(null); }

  confirmDelete() {
    const id = this.confirmDeleteId();
    if (!id) return;
    this.confirmDeleteId.set(null);
    this.accountService
      .deleteAccount(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {})
      )
      .subscribe({
        next: () => {
          this.errorHandler.handleSuccess('Cuenta eliminada');
          this.loadAccounts();
        },
        error: (err) => {
          this.errorHandler.handleHttpError(err, 'AccountList - delete account');
        },
      });
  }

  formatBalance(balance: number, moneda: string) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: moneda,
      maximumFractionDigits: 0,
    }).format(balance);
  }

  tipoIcon(tipo: string): string {
    const map: Record<string, string> = {
      efectivo: '💵', ahorro: '🏦', corriente: '🏧', credito: '💳', inversion: '📈',
    };
    return map[tipo] ?? '💰';
  }

  onPrevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadAccounts();
    }
  }

  onNextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadAccounts();
    }
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadAccounts();
  }
}
