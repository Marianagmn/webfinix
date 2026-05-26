import { Component, inject, signal, DestroyRef, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
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
 *     [recordId]="selectedRecordId()"
 *     (onSuccess)="handleReverseSuccess()"
 *     (onCancel)="handleReverseCancel()">
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

  @Input() recordId!: string;
  @Output() onSuccess = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup = this.fb.group({
    motivo: ['', [Validators.required, Validators.minLength(10)]],
    referencia: [''],
  });

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
          this.form.reset();
          this.onSuccess.emit();
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
    this.onCancel.emit();
  }
}
