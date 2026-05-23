import { Component, inject, signal, computed, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BusinessFinanceService } from '../../../services/business-finance.service';
import { BusinessFinance, BusinessFinanceStatus } from '../../../models/transaction.model';

@Component({
  selector: 'app-approval-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './approval-list.html',
  styleUrl: './approval-list.css',
})
export class ApprovalList implements OnInit {
  private readonly service = inject(BusinessFinanceService);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly approvals = signal<BusinessFinance[]>([]);
  readonly isLoading = signal(false);
  readonly hasError = signal(false);
  readonly processingId = signal<string | null>(null);

  readonly totalPending = computed(() => this.approvals().length);
  readonly totalAmount = computed(() => 
    this.approvals().reduce((sum, tx) => sum + tx.monto, 0)
  );

  ngOnInit(): void {
    this.loadApprovals();
  }

  loadApprovals(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.service.getPendingApprovals()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.approvals.set(res.data);
          this.isLoading.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.isLoading.set(false);
        },
      });
  }

  approve(id: string, comentario?: string): void {
    this.processingId.set(id);
    this.service.approve(id, comentario)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastr.success('Transacción aprobada');
          this.processingId.set(null);
          this.loadApprovals();
        },
        error: () => {
          this.toastr.error('Error al aprobar transacción');
          this.processingId.set(null);
        },
      });
  }

  reject(id: string, motivo?: string): void {
    this.processingId.set(id);
    this.service.reject(id, motivo)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastr.success('Transacción rechazada');
          this.processingId.set(null);
          this.loadApprovals();
        },
        error: () => {
          this.toastr.error('Error al rechazar transacción');
          this.processingId.set(null);
        },
      });
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
}
