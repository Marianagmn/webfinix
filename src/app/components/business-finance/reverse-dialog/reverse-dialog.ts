import { Component, inject, signal, DestroyRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BusinessFinanceService } from '../../../services/business-finance.service';

/**
 * Modal para revertir (reversear) un asiento contable.
 * 
 * Uso:
 *   <app-reverse-dialog 
 *     [visible]="showReverseModal()"
 *     [recordId]="selectedRecordId()"
 *     (onSubmit)="handleReverse($event)"
 *     (onCancel)="showReverseModal.set(false)">
 *   </app-reverse-dialog>
 */
@Component({
  selector: 'app-reverse-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reverse-dialog.html',
  styleUrl: './reverse-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReverseDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly businessService = inject(BusinessFinanceService);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);
  readonly isSaving = signal(false);

  form: FormGroup = this.fb.group({
    motivo: ['', [Validators.required, Validators.minLength(10)]],
    referencia: [''],
  });

  /**
   * ID del asiento contable a revertir.
   * Debe establecerse antes de abrir el modal.
   */
  recordId: string = '';

  /**
   * Envía la solicitud de reversión al backend.
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.recordId) {
      this.toastr.error('ID del registro no especificado');
      return;
    }

    this.isSaving.set(true);

    const payload = {
      motivo: this.form.get('motivo')?.value,
      referencia: this.form.get('referencia')?.value || undefined,
    };

    this.businessService
      .reverseRecord(this.recordId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastr.success('Asiento revertido correctamente');
          this.isSaving.set(false);
        },
        error: () => {
          this.toastr.error('Error al revertir asiento');
          this.isSaving.set(false);
        },
      });
  }

  /**
   * Cierra el modal sin guardar cambios.
   */
  dismiss(): void {
    this.form.reset();
  }
}
