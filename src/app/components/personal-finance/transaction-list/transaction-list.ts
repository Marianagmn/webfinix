import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { PersonalFinanceService } from '../../../services/personal-finance.service';
import { PersonalFinance } from '../../../models/personal-finance.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './transaction-list.html',
  styleUrls: ['./transaction-list.css'],
})
export class TransactionList implements OnInit {
  private readonly financeService = inject(PersonalFinanceService);
  private readonly errorHandler = inject(ErrorHandlerService);
  // M-04: DestroyRef para takeUntilDestroyed y evitar memory leaks
  private readonly destroyRef = inject(DestroyRef);

  readonly transactions = signal<PersonalFinance[]>([]);
  readonly filteredTransactions = signal<PersonalFinance[]>([]);
  readonly isLoading = signal(false);
  // B-02: estado para modal de confirmación en lugar de confirm() nativo
  readonly confirmDeleteId = signal<string | null>(null);
  searchTerm = '';
  
  // Pagination state
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly totalItems = signal(0);
  readonly pageSize = signal(20);

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.isLoading.set(true);
    this.financeService
      .getTransactions({ page: this.currentPage(), limit: this.pageSize() })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          const data = res.data ?? [];
          this.transactions.set(data);
          this.filteredTransactions.set(data);
          
          // Update pagination from meta
          if (res.meta?.pagination) {
            this.currentPage.set(res.meta.pagination.page);
            this.totalPages.set(res.meta.pagination.totalPages);
            this.totalItems.set(res.meta.pagination.total);
          }
        },
        error: (err) => {
          this.errorHandler.handleHttpError(err, 'TransactionList - load transactions');
          this.filteredTransactions.set([]);
        },
      });
  }

  filterTransactions() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredTransactions.set(this.transactions());
      return;
    }
    // A-02: filtrar por campos REALES del backend (descripcion, tipo, fecha)
    this.filteredTransactions.set(
      this.transactions().filter((t) =>
        [t.descripcion, t.tipo, t.fecha]
          .filter(Boolean)
          .some((v) => v!.toString().toLowerCase().includes(term))
      )
    );
  }

  // B-02: abrir modal de confirmación en lugar de confirm() nativo
  requestDelete(id: string) {
    this.confirmDeleteId.set(id);
  }

  cancelDelete() {
    this.confirmDeleteId.set(null);
  }

  confirmDelete() {
    const id = this.confirmDeleteId();
    if (!id) return;
    this.confirmDeleteId.set(null);

    const transaction = this.transactions().find(t => t.id === id);
    if (!transaction) return;

    this.financeService
      .deleteTransaction(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {})
      )
      .subscribe({
        next: () => {
          this.errorHandler.handleSuccess('Transacción eliminada');
          this.loadTransactions();
        },
        error: (err) => {
          this.errorHandler.handleHttpError(err, 'TransactionList - delete transaction');
        },
      });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadTransactions();
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

  formatAmount(amount: number, moneda = 'COP') {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: moneda,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  tipoColor(tipo: string): string {
    const map: Record<string, string> = {
      ingreso: 'success',
      gasto: 'danger',
      transferencia: 'info',
    };
    return map[tipo] ?? 'secondary';
  }

  tipoIcon(tipo: string): string {
    const map: Record<string, string> = {
      ingreso: '↑',
      gasto: '↓',
      transferencia: '⇄',
    };
    return map[tipo] ?? '•';
  }
}
