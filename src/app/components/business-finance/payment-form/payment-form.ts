import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BusinessFinanceService } from '../../../services/business-finance.service';
import { BusinessFinance } from '../../../models/transaction.model';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.css',
})
export class PaymentForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(BusinessFinanceService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly transaction = signal<BusinessFinance | null>(null);
  readonly transactionId = signal<string>('');

  paymentForm: FormGroup = this.fb.group({
    pagoId: ['', Validators.required],
    monto: [null as number | null, [Validators.required, Validators.min(0.01)]],
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
          this.transaction.set(res.data);
          this.isLoading.set(false);
        },
        error: () => {
          this.toastr.error('Error al cargar transacción');
          this.router.navigate(['/business-finance']);
        },
      });
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const raw = this.paymentForm.value;

    this.service.applyPayment(this.transactionId(), {
      pagoId: raw.pagoId,
      monto: raw.monto!,
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastr.success('Pago aplicado exitosamente');
          this.router.navigate(['/business-finance']);
        },
        error: () => {
          this.toastr.error('Error al aplicar pago');
          this.isSaving.set(false);
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/business-finance']);
  }
}
