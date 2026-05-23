import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { BusinessFinanceService } from '../../../services/business-finance.service';
import { CreateBusinessFinanceDto, BusinessFinance } from '../../../models/transaction.model';

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

  readonly isSaving = signal(false);

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
    this.businessForm.patchValue({
      fecha: new Date().toISOString().split('T')[0],
    });
  }

  onSubmit(): void {
    if (this.businessForm.invalid) {
      this.businessForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const raw = this.businessForm.value;

    const payload: CreateBusinessFinanceDto = {
      tipo: raw.tipo,
      monto: raw.monto!,
      moneda: raw.moneda || 'COP',
      categoria: raw.categoria,
      descripcion: raw.descripcion,
      fecha: raw.fecha,
      terceroId: raw.terceroId || undefined,
    };

    this.service.createTransaction(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastr.success('Transacción empresarial creada');
          this.router.navigate(['/business-finance']);
        },
        error: () => {
          this.toastr.error('Error al crear transacción');
          this.isSaving.set(false);
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/business-finance']);
  }
}
