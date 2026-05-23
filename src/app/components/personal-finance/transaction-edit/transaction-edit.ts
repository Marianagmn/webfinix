import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PersonalFinanceService } from '../../../services/personal-finance.service';
import { CategoryService } from '../../../services/category.service';
import { AccountService } from '../../../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Category, CategoryTipo } from '../../../models/category.model';
import { Account } from '../../../models/account.model';
import { PersonalFinance, TransactionTipo, MetodoPago } from '../../../models/personal-finance.model';

@Component({
  selector: 'app-transaction-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './transaction-edit.html',
  styleUrl: './transaction-edit.css',
})
export class TransactionEdit implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly financeService = inject(PersonalFinanceService);
  private readonly categoryService = inject(CategoryService);
  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly categories = signal<Category[]>([]);
  readonly accounts = signal<Account[]>([]);

  txnForm: FormGroup = this.fb.group({
    tipo: ['gasto' as TransactionTipo, Validators.required],
    monto: [null as number | null, [Validators.required, Validators.min(0.01)]],
    moneda: ['COP'],
    categoriaId: ['', Validators.required],
    cuentaOrigenId: [''],
    cuentaDestinoId: [''],
    descripcion: [''],
    fecha: ['', Validators.required],
    metodoPago: ['efectivo' as MetodoPago],
    tags: [''],
    esAhorro: [false]
  });

  transactionId: string = '';

  ngOnInit(): void {
    this.transactionId = this.route.snapshot.paramMap.get('id') || '';

    this.accountService.getAccounts().subscribe(accs => this.accounts.set(accs || []));

    this.route.queryParams.subscribe(params => {
      const tipo = params['tipo'] || 'gasto';
      this.txnForm.patchValue({ tipo });
      this.loadCategories(tipo as 'ingreso' | 'gasto' | 'transferencia');
    });

    this.txnForm.get('tipo')?.valueChanges.subscribe(tipo => {
      this.loadCategories(tipo as 'ingreso' | 'gasto' | 'transferencia');
      this.txnForm.patchValue({ categoriaId: '' });
    });

    if (this.transactionId) {
      this.loadTransaction();
    }
  }

  loadTransaction(): void {
    this.financeService.getTransactionById(this.transactionId).subscribe({
      next: (response) => {
        const txn = response.data;
        this.txnForm.patchValue({
          tipo: txn.tipo,
          monto: txn.monto,
          moneda: txn.moneda ?? 'COP',
          categoriaId: txn.categoria ?? '',
          cuentaOrigenId: txn.cuentaOrigenId ?? '',
          cuentaDestinoId: txn.cuentaDestinoId ?? '',
          descripcion: txn.descripcion ?? '',
          fecha: txn.fecha?.substring(0, 10) ?? '',
          metodoPago: txn.metodoPago ?? 'efectivo',
          tags: txn.tags?.join(', ') ?? '',
          esAhorro: txn.esAhorro ?? false
        });
        this.loadCategories(txn.tipo as 'ingreso' | 'gasto' | 'transferencia');
        this.isLoading.set(false);
      },
      error: () => {
        this.toastr.error('Error al cargar transacción');
        this.router.navigate(['/personal-finance']);
      }
    });
  }

  loadCategories(tipo: 'ingreso' | 'gasto' | 'transferencia'): void {
    this.categoryService.getCategories(tipo).subscribe(cats => {
      this.categories.set(cats || []);
    });
  }

  onSubmit(): void {
    if (this.txnForm.invalid) {
      this.txnForm.markAllAsTouched();
      return;
    }

    const raw = this.txnForm.value;
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

    this.isSaving.set(true);
    this.financeService.updateTransaction(this.transactionId, payload).subscribe({
      next: () => {
        this.toastr.success('Transacción actualizada');
        this.router.navigate(['/personal-finance']);
      },
      error: () => {
        this.toastr.error('Error al actualizar transacción');
        this.isSaving.set(false);
      }
    });
  }
}
