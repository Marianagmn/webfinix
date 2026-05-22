import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AccountService } from '../../../services/account.service';
import { AccountType, Currency } from '../../../models/account.model';

@Component({
  selector: 'app-account-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './account-edit.html',
  styleUrl: './account-edit.css',
})
export class AccountEdit implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);
  private readonly accountService = inject(AccountService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly loadingData = signal(true);
  readonly tipos: AccountType[] = ['efectivo', 'ahorro', 'corriente', 'credito', 'inversion'];
  readonly monedas: Currency[] = ['COP', 'USD', 'EUR'];

  private accountId!: string;

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    tipo: ['ahorro' as AccountType, Validators.required],
    moneda: ['COP' as Currency, Validators.required],
    balance: [0, [Validators.required, Validators.min(0)]],
    descripcion: [''],
  });

  ngOnInit() {
    this.accountId = this.route.snapshot.paramMap.get('id')!;
    this.accountService.getAccountById(this.accountId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (account) => {
          this.form.patchValue({
            nombre: account.nombre,
            tipo: account.tipo,
            moneda: account.moneda,
            balance: account.balance,
            descripcion: account.descripcion ?? '',
          });
          this.loadingData.set(false);
        },
        error: () => {
          this.toastr.error('No se pudo cargar la cuenta.');
          this.router.navigate(['/accounts']);
        },
      });
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const raw = this.form.value;
    this.accountService.updateAccount(this.accountId, {
      nombre: raw.nombre!,
      tipo: raw.tipo!,
      moneda: raw.moneda!,
      balance: raw.balance!,
      descripcion: raw.descripcion || undefined,
    }).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.loading.set(false); this.toastr.success('Cuenta actualizada'); this.router.navigate(['/accounts']); },
        error: () => this.loading.set(false),
      });
  }
}
