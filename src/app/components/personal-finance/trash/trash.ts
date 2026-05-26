import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PersonalFinanceService } from '../../../services/personal-finance.service';
import { PersonalFinance } from '../../../models/personal-finance.model';
import { PaginatedResponse } from '../../../models/api-response.model';

@Component({
  selector: 'app-transaction-trash',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trash.html',
  styleUrl: './trash.css',
})
export class TransactionTrash implements OnInit {
  private readonly financeService = inject(PersonalFinanceService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(true);
  readonly isRestoring = signal(false);
  readonly isDeleting = signal(false);
  readonly deletedTransactions = signal<PersonalFinance[]>([]);
  readonly currentPage = signal(1);
  readonly pageSize = signal(20);
  readonly totalItems = signal(0);
  readonly searchQuery = signal('');
  readonly selectedTipo = signal('');
  readonly confirmRestoreId = signal<string | null>(null);
  readonly confirmPermanentDeleteId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadDeletedTransactions();
  }

  loadDeletedTransactions(): void {
    this.isLoading.set(true);

    this.financeService
      .getDeletedTransactions({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchQuery() || undefined,
        tipo: this.selectedTipo() || undefined,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.deletedTransactions.set(response.data);
          if (response.meta?.pagination) {
            this.totalItems.set(response.meta.pagination.total);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.toastr.error('Error al cargar transacciones eliminadas');
          this.isLoading.set(false);
        },
      });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadDeletedTransactions();
  }

  onTypeFilter(tipo: string): void {
    this.selectedTipo.set(tipo === this.selectedTipo() ? '' : tipo);
    this.currentPage.set(1);
    this.loadDeletedTransactions();
  }

  requestRestore(id: string): void {
    this.confirmRestoreId.set(id);
  }

  cancelRestore(): void {
    this.confirmRestoreId.set(null);
  }

  confirmRestore(): void {
    const id = this.confirmRestoreId();
    if (!id) return;
    this.confirmRestoreId.set(null);

    this.isRestoring.set(true);

    this.financeService
      .restoreTransaction(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastr.success('Transacción restaurada correctamente');
          this.isRestoring.set(false);
          this.loadDeletedTransactions();
        },
        error: () => {
          this.toastr.error('Error al restaurar transacción');
          this.isRestoring.set(false);
        },
      });
  }

  requestPermanentDelete(id: string): void {
    this.confirmPermanentDeleteId.set(id);
  }

  cancelPermanentDelete(): void {
    this.confirmPermanentDeleteId.set(null);
  }

  confirmPermanentDelete(): void {
    const id = this.confirmPermanentDeleteId();
    if (!id) return;
    this.confirmPermanentDeleteId.set(null);

    this.isDeleting.set(true);

    this.financeService
      .permanentlyDeleteTransaction(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastr.success('Transacción eliminada permanentemente');
          this.isDeleting.set(false);
          this.loadDeletedTransactions();
        },
        error: () => {
          this.toastr.error('Error al eliminar transacción permanentemente');
          this.isDeleting.set(false);
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/personal-finance']);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems() / this.pageSize());
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadDeletedTransactions();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadDeletedTransactions();
    }
  }
}
