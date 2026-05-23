import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { BusinessFinanceService } from '../../../services/business-finance.service';
import { BusinessFinance, BusinessFinanceStatus } from '../../../models/transaction.model';

@Component({
  selector: 'app-business-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './business-list.html',
  styleUrl: './business-list.css',
})
export class BusinessList implements OnInit {
  private readonly service = inject(BusinessFinanceService);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly transactions = signal<BusinessFinance[]>([]);
  readonly pagination = signal<{ page: number; limit: number; total: number; totalPages: number } | null>(null);
  readonly isLoading = signal(false);
  readonly hasError = signal(false);
  readonly filter = signal<{ page: number; limit: number; tipo?: string; estado?: BusinessFinanceStatus }>({ page: 1, limit: 20 });
  readonly deleteTargetId = signal<string | null>(null);

  readonly totalItems = computed(() => this.pagination()?.total ?? 0);
  readonly currentPage = computed(() => this.filter().page ?? 1);
  readonly totalPages = computed(() => this.pagination()?.totalPages ?? 1);
  readonly showDeleteModal = computed(() => !!this.deleteTargetId());

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.service.getTransactionsPaginated(this.filter().page, this.filter().limit, {
      tipo: this.filter().tipo,
      estado: this.filter().estado
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.transactions.set(res.data);
          this.pagination.set(res.meta as { page: number; limit: number; total: number; totalPages: number } || null);
          this.isLoading.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.isLoading.set(false);
        },
      });
  }

  onFilterChange(partial: Partial<{ tipo?: string; estado?: BusinessFinanceStatus }>): void {
    this.filter.update((f) => ({ ...f, ...partial, page: 1 }));
    this.loadTransactions();
  }

  onPageChange(page: number): void {
    this.filter.update((f) => ({ ...f, page }));
    this.loadTransactions();
  }

  requestDelete(id: string): void {
    this.deleteTargetId.set(id);
  }

  confirmDelete(): void {
    const id = this.deleteTargetId();
    if (!id) return;

    this.service.deleteTransaction(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastr.success('Transacción eliminada');
          this.deleteTargetId.set(null);
          this.loadTransactions();
        },
        error: () => {
          this.toastr.error('No se pudo eliminar la transacción');
          this.deleteTargetId.set(null);
        },
      });
  }

  cancelDelete(): void {
    this.deleteTargetId.set(null);
  }

  tipoLabel(tipo: string): string {
    const labels: Record<string, string> = {
      cobrar: 'Cobrar',
      pagar: 'Pagar',
      factura_venta: 'Factura Venta',
      factura_compra: 'Factura Compra',
      nomina: 'Nómina',
      activo_fijo: 'Activo Fijo',
    };
    return labels[tipo] || tipo;
  }

  estadoLabel(estado: BusinessFinanceStatus): string {
    const labels: Record<BusinessFinanceStatus, string> = {
      borrador: 'Borrador',
      pendiente: 'Pendiente',
      aprobada: 'Aprobada',
      contabilizada: 'Contabilizada',
      rechazada: 'Rechazada',
      anulado: 'Anulado',
      en_disputa: 'En Disputa',
    };
    return labels[estado];
  }

  estadoClass(estado: BusinessFinanceStatus): string {
    const classes: Record<BusinessFinanceStatus, string> = {
      borrador: 'bg-secondary',
      pendiente: 'bg-warning',
      aprobada: 'bg-success',
      contabilizada: 'bg-primary',
      rechazada: 'bg-danger',
      anulado: 'bg-dark',
      en_disputa: 'bg-info',
    };
    return classes[estado];
  }
}
