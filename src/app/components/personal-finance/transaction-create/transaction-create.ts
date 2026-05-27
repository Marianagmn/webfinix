import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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
  readonly metodosPago: MetodoPago[] = ['efectivo', 'transferencia', 'tarjeta_credito', 'tarjeta_debito', 'cheque', 'otro'];

  readonly form = this.fb.group({
    tipo: ['ingreso' as TransactionTipo, Validators.required],
    monto: [null as number | null, [Validators.required, Validators.min(0.01)]],
    moneda: ['COP'],
    categoria: ['', Validators.required],
    cuentaOrigenId: [''],
    cuentaDestinoId: [''],
    descripcion: [''],
    fecha: [new Date().toISOString().split('T')[0], Validators.required],
    metodoPago: ['efectivo' as MetodoPago],
    tags: [''],
    esAhorro: [false],
  });

  // Dynamic validators based on transaction type
  constructor() {
    this.setupDynamicValidators();
  }

  private setupDynamicValidators() {
    this.form.get('tipo')?.valueChanges.subscribe(tipo => {
      const cuentaOrigenId = this.form.get('cuentaOrigenId');
      const cuentaDestinoId = this.form.get('cuentaDestinoId');

      if (tipo === 'transferencia') {
        cuentaOrigenId?.setValidators([Validators.required]);
        cuentaDestinoId?.setValidators([Validators.required]);
      } else {
        cuentaOrigenId?.clearValidators();
        cuentaDestinoId?.clearValidators();
      }
      cuentaOrigenId?.updateValueAndValidity();
      cuentaDestinoId?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.accountService
      .getAccounts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (accounts) => this.accounts.set(accounts ?? []) });
  }

  loadCategories() {
    this.categoryService
      .getCategories(this.tipoValue)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (categories) => this.categories.set(categories ?? []) });
  }

  get tipoValue(): TransactionTipo {
    return this.form.get('tipo')?.value as TransactionTipo;
  }

  onTipoChange() {
    this.loadCategories();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (!this.form.get('categoria')?.value) {
      this.toastr.error('Debes seleccionar una categoría');
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

    const tipo = raw.tipo as TransactionTipo;
    
    // Build clean payload without undefined values
    const payload: any = {
      tipo: tipo,
      monto: raw.monto!,
      moneda: raw.moneda || 'COP',
      categoria: raw.categoria,
      descripcion: raw.descripcion || undefined,
      fecha: raw.fecha ? new Date(raw.fecha).toISOString() : undefined,
      metodoPago: (raw.metodoPago as MetodoPago) || 'efectivo',
      tags: tagsArray,
      esAhorro: raw.esAhorro ?? false,
    };

    // Only include account fields based on transaction type
    if (tipo === 'transferencia') {
      if (raw.cuentaOrigenId) payload.cuentaOrigenId = raw.cuentaOrigenId;
      if (raw.cuentaDestinoId) payload.cuentaDestinoId = raw.cuentaDestinoId;
    } else if (tipo === 'ingreso') {
      if (raw.cuentaOrigenId) payload.cuentaOrigenId = raw.cuentaOrigenId;
    } else if (tipo === 'gasto') {
      if (raw.cuentaOrigenId) payload.cuentaOrigenId = raw.cuentaOrigenId;
    }

    console.log('Creating transaction with payload:', payload);

    this.financeService
      .createTransaction(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('Transaction created successfully:', response);
          this.loading.set(false);
          this.toastr.success('Transacción creada correctamente');
          this.router.navigate(['/personal-finance']);
        },
        error: (err) => {
          console.error('Transaction creation error:', err);
          this.loading.set(false);
          const message = (err.error as any)?.message || err.message || 'Error al crear transacción';
          this.toastr.error(message);
        },
      });
  }
}
