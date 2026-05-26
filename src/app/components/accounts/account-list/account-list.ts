import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/account.model';
import { PaginatedResponse } from '../../../models/api-response.model';

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

  // Pagination state
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly totalItems = signal(0);
  readonly pageSize = signal(20);

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.isLoading.set(true);
    this.accountService
      .getAccounts(this.currentPage(), this.pageSize())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: PaginatedResponse<Account>) => {
          const data = res.data ?? [];
          this.accounts.set(data);
          
          // Update pagination from meta
          if (res.meta?.pagination) {
            this.currentPage.set(res.meta.pagination.page);
            this.totalPages.set(res.meta.pagination.totalPages);
            this.totalItems.set(res.meta.pagination.total);
          }
          
          this.isLoading.set(false);
        },
        error: () => {
          this.toastr.error('No se pudieron cargar las cuentas.');
          this.isLoading.set(false);
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.toastr.success('Cuenta eliminada'); this.loadAccounts(); },
        error: () => this.toastr.error('No se pudo eliminar la cuenta.'),
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

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadAccounts();
  }

  onNextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.onPageChange(this.currentPage() + 1);
    }
  }

  onPrevPage() {
    if (this.currentPage() > 1) {
      this.onPageChange(this.currentPage() - 1);
    }
  }
}
