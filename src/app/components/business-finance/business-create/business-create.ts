import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { BusinessFinanceService } from '../../../services/business-finance.service';
import { CreateBusinessFinanceDto, BusinessFinance } from '../../../models/business-finance.model';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-business-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './business-create.html',
  styleUrl: './business-create.css',
})
export class BusinessCreate implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(BusinessFinanceService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authStore = inject(AuthStore);

  readonly isSaving = signal(false);

  businessForm: FormGroup = this.fb.group({
    tipo: ['ingreso' as const, Validators.required],
    monto: [null as number | null, [Validators.required, Validators.min(0.01)]],
    moneda: ['COP'],
    descripcion: ['', [Validators.required, Validators.minLength(3)]],
    fecha: ['', Validators.required],
    terceroId: [''],
    esRecurrente: [false],
    recurrencia: this.fb.group({
      frecuencia: ['mensual'],
      diaCiclo: [null],
      fechaInicio: [''],
      fechaFin: [''],
      totalOcurrencias: [null],
    }),
  });

  ngOnInit(): void {
    this.businessForm.patchValue({
      fecha: new Date().toISOString().split('T')[0],
    });
  }

  onSubmit(): void {
    console.log('onSubmit called, form valid:', !this.businessForm.invalid);
    console.log('Form value:', this.businessForm.value);
    console.log('Form controls status:', {
      tipo: this.businessForm.get('tipo')?.valid,
      monto: this.businessForm.get('monto')?.valid,
      moneda: this.businessForm.get('moneda')?.valid,
      descripcion: this.businessForm.get('descripcion')?.valid,
      fecha: this.businessForm.get('fecha')?.valid,
    });

    if (this.businessForm.invalid) {
      console.log('Form is invalid, errors:', this.businessForm.errors);
      console.log('Individual field errors:', {
        tipo: this.businessForm.get('tipo')?.errors,
        monto: this.businessForm.get('monto')?.errors,
        moneda: this.businessForm.get('moneda')?.errors,
        descripcion: this.businessForm.get('descripcion')?.errors,
        fecha: this.businessForm.get('fecha')?.errors,
      });
      this.businessForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const raw = this.businessForm.value;

    const user = this.authStore.user();
    if (!user?.id) {
      this.toastr.error('Usuario no autenticado');
      this.isSaving.set(false);
      return;
    }

    const payload: any = {
      tipo: raw.tipo,
      monto: raw.monto!,
      moneda: raw.moneda || 'COP',
      descripcion: raw.descripcion,
      fecha: raw.fecha,
      terceroId: raw.terceroId || undefined,
      esRecurrente: raw.esRecurrente,
      recurrencia: raw.esRecurrente ? raw.recurrencia : undefined,
      userId: user.id,
    };

    console.log('Creating business transaction with payload:', payload);
    this.service.createTransaction(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('Business transaction created successfully:', response);
          this.toastr.success('Transacción empresarial creada');
          this.router.navigate(['/business-finance']);
        },
        error: (err) => {
          console.error('Error creating business transaction:', err);
          console.error('Error status:', err.status);
          console.error('Error body:', err.error);
          const message = (err.error as any)?.message || err.message || 'Error al crear transacción';
          this.toastr.error(message);
          this.isSaving.set(false);
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/business-finance']);
  }
}
