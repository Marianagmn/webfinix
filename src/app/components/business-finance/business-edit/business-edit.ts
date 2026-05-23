import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BusinessFinanceService } from '../../../services/business-finance.service';
import { BusinessFinance, UpdateBusinessFinanceDto } from '../../../models/transaction.model';

@Component({
  selector: 'app-business-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './business-edit.html',
  styleUrl: './business-edit.css',
})
export class BusinessEdit implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(BusinessFinanceService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly transactionId = signal<string>('');

  businessForm: FormGroup = this.fb.group({
    tipo: ['cobrar' as const, Validators.required],
    monto: [null as number | null, [Validators.required, Validators.min(0.01)]],
    moneda: ['COP'],
    categoria: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(3)]],
    fecha: ['', Validators.required],
    terceroId: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastr.error('ID de transacción no proporcionado');
      this.router.navigate(['/business-finance']);
      return;
    }

    this.transactionId.set(id);
    this.loadTransaction();
  }

  loadTransaction(): void {
    this.service.getTransactionById(this.transactionId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const tx = res.data;
          this.businessForm.patchValue({
            tipo: tx.tipo,
            monto: tx.monto,
            moneda: tx.moneda,
            categoria: tx.categoria,
            descripcion: tx.descripcion,
            fecha: tx.fecha ? tx.fecha.split('T')[0] : '',
            terceroId: tx.terceroId || '',
          });
          this.isLoading.set(false);
        },
        error: () => {
          this.toastr.error('Error al cargar transacción');
          this.router.navigate(['/business-finance']);
        },
      });
  }

  onSubmit(): void {
    if (this.businessForm.invalid) {
      this.businessForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const raw = this.businessForm.value;

    const payload: UpdateBusinessFinanceDto = {
      tipo: raw.tipo,
      monto: raw.monto!,
      moneda: raw.moneda || 'COP',
      categoria: raw.categoria,
      descripcion: raw.descripcion,
      fecha: raw.fecha,
      terceroId: raw.terceroId || undefined,
    };

    this.service.updateTransaction(this.transactionId(), payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastr.success('Transacción actualizada');
          this.router.navigate(['/business-finance']);
        },
        error: () => {
          this.toastr.error('Error al actualizar transacción');
          this.isSaving.set(false);
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/business-finance']);
  }
}
