import { Component, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AccountService } from '../../../services/account.service';
import { AccountType, Currency } from '../../../models/account.model';

@Component({
  selector: 'app-account-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './account-create.html',
  styleUrl: './account-create.css',
})
export class AccountCreate {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly accountService = inject(AccountService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly tipos: AccountType[] = ['efectivo', 'ahorro', 'corriente', 'credito', 'inversion'];
  readonly monedas: Currency[] = ['COP', 'USD', 'EUR'];

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    tipo: ['ahorro' as AccountType, Validators.required],
    moneda: ['COP' as Currency, Validators.required],
    balance: [0, [Validators.required, Validators.min(0)]],
    descripcion: [''],
  });

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const raw = this.form.value;
    this.accountService.createAccount({
      nombre: raw.nombre!,
      tipo: raw.tipo!,
      moneda: raw.moneda!,
      balance: raw.balance!,
      descripcion: raw.descripcion || undefined,
    }).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.loading.set(false); this.toastr.success('Cuenta creada'); this.router.navigate(['/accounts']); },
        error: () => this.loading.set(false),
      });
  }
}
