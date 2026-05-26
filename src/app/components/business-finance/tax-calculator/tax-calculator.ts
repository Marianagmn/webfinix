import { Component, inject, signal, DestroyRef, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BusinessFinanceService } from '../../../services/business-finance.service';

interface TaxCalculationResult {
  income: number;
  expenses: number;
  taxableIncome: number;
  estimatedTax: number;
  effectiveRate: number;
  dateCalculated: string;
}

/**
 * Componente para recalcular impuestos de un registro de finanzas empresariales.
 *
 * Permite al usuario ver un resumen de ingresos, gastos y impuestos calculados,
 * y tiene la opción de recalcular los impuestos si ha habido cambios.
 */
@Component({
  selector: 'app-tax-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tax-calculator.html',
  styleUrl: './tax-calculator.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxCalculatorComponent {
  private readonly fb = inject(FormBuilder);
  private readonly businessService = inject(BusinessFinanceService);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);
  readonly isCalculating = signal(false);
  readonly taxResult = signal<TaxCalculationResult | null>(null);

  @Input() recordId!: string;
  @Output() onCalculationComplete = new EventEmitter<TaxCalculationResult>();

  /**
   * Recalcula los impuestos del registro.
   * El backend recalcula los impuestos basándose en el monto actual y las tarifas configuradas.
   */
  calculateTaxes(): void {
    if (!this.recordId) {
      this.toastr.error('ID del registro no especificado');
      return;
    }

    this.isCalculating.set(true);

    this.businessService
      .recalculateTaxes(this.recordId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const result = response.data as TaxCalculationResult;
          this.taxResult.set(result);
          this.toastr.success('Impuestos recalculados correctamente');
          this.isCalculating.set(false);
          this.onCalculationComplete.emit(result);
        },
        error: () => {
          this.toastr.error('Error al recalcular impuestos');
          this.isCalculating.set(false);
        },
      });
  }

  /**
   * Formatea un número como moneda.
   */
  formatCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined) return '$ 0.00';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
    }).format(value);
  }

  /**
   * Formatea un porcentaje.
   */
  formatPercent(value: number | null | undefined): string {
    if (value === null || value === undefined) return '0.00%';
    return `${(value * 100).toFixed(2)}%`;
  }
}
