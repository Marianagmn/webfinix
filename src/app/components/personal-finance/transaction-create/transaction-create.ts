import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PersonalFinanceService } from '../../../services/personal-finance.service';
import { CategoryService } from '../../../services/category.service';
import { AccountService } from '../../../services/account.service';
import { Category } from '../../../models/category.model';
import { Account } from '../../../models/account.model';
import { TransactionTipo, MetodoPago } from '../../../models/personal-finance.model';

@Component({
  selector: 'app-transaction-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './transaction-create.html',
  styleUrl: './transaction-create.css',
})
export class TransactionCreate implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly financeService = inject(PersonalFinanceService);
  private readonly categoryService = inject(CategoryService);
  private readonly accountService = inject(AccountService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly categories = signal<Category[]>([]);
  readonly accounts = signal<Account[]>([]);

  readonly tipos: TransactionTipo[] = ['ingreso', 'gasto', 'transferencia'];
  readonly metodosPago: MetodoPago[] = ['efectivo', 'tarjeta', 'transferencia', 'cheque', 'otro'];

  readonly form = this.fb.group({
    tipo: ['ingreso' as TransactionTipo, Validators.required],
    monto: [null as number | null, [Validators.required, Validators.min(0.01)]],
    moneda: ['COP'],
    categoriaId: ['', Validators.required],
    cuentaOrigenId: [''],
    cuentaDestinoId: [''],
    descripcion: [''],
    fecha: [new Date().toISOString().split('T')[0], Validators.required],
    metodoPago: ['efectivo' as MetodoPago],
    tags: [''],
    esAhorro: [false],
  });

  ngOnInit() {
    this.categoryService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (r) => this.categories.set(r.data) });

    this.accountService
      .getAccounts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (data) => this.accounts.set(data) });
  }

  get tipoValue(): TransactionTipo {
    return this.form.get('tipo')?.value as TransactionTipo;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    const raw = this.form.value;
    const tagsArray = raw.tags
      ? raw.tags
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean)
      : [];

    const payload = {
      tipo: raw.tipo!,
      monto: raw.monto!,
      moneda: raw.moneda || 'COP',
      categoriaId: raw.categoriaId || undefined,
      cuentaOrigenId: raw.cuentaOrigenId || undefined,
      cuentaDestinoId: raw.cuentaDestinoId || undefined,
      descripcion: raw.descripcion || undefined,
      fecha: raw.fecha || undefined,
      metodoPago: (raw.metodoPago as MetodoPago) || 'efectivo',
      tags: tagsArray,
      esAhorro: raw.esAhorro ?? false,
    };

    this.financeService
      .createTransaction(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.toastr.success('Transacción creada correctamente');
          this.router.navigate(['/personal-finance']);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }
}
