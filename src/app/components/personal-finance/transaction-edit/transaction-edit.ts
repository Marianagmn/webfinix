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
import { PersonalFinance } from '../../../models/transaction.model';

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
    amount: [null, [Validators.required, Validators.min(0.01)]],
    type: ['expense', Validators.required],
    categoryId: ['', Validators.required],
    accountId: ['', Validators.required],
    date: ['', Validators.required],
    description: ['', Validators.required],
    tags: [''],
    isRecurring: [false]
  });

  transactionId: string = '';

  ngOnInit(): void {
    this.transactionId = this.route.snapshot.paramMap.get('id') || '';

    this.accountService.getAccounts().subscribe(accs => this.accounts.set(accs || []));

    this.route.queryParams.subscribe(params => {
      const type = params['type'] || 'gasto';
      this.txnForm.patchValue({ type });
      this.loadCategories(type as CategoryTipo);
    });

    this.txnForm.get('type')?.valueChanges.subscribe(type => {
      this.loadCategories(type as CategoryTipo);
      this.txnForm.patchValue({ categoryId: '' });
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
          amount: txn.monto,
          type: txn.tipo,
          categoryId: txn.categoria,
          accountId: txn.cuentaOrigenId,
          date: txn.fecha.substring(0, 10),
          description: txn.descripcion,
          tags: txn.tags?.join(', ') || '',
          isRecurring: txn.esAhorro
        });
        this.loadCategories(txn.tipo);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastr.error('Error al cargar transacción');
        this.router.navigate(['/transactions']);
      }
    });
  }

  loadCategories(type: CategoryTipo): void {
    this.categoryService.getCategories(type).subscribe(cats => {
      this.categories.set(cats.data || []);
    });
  }

  onSubmit(): void {
    if (this.txnForm.invalid) {
      this.txnForm.markAllAsTouched();
      return;
    }

    const formValue = { ...this.txnForm.value };
    if (formValue.tags && typeof formValue.tags === 'string') {
      formValue.tags = formValue.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t);
    } else {
      formValue.tags = [];
    }

    this.isSaving.set(true);
    this.financeService.updateTransaction(this.transactionId, formValue).subscribe({
      next: () => {
        this.toastr.success('Transacción actualizada');
        this.router.navigate(['/transactions']);
      },
      error: () => {
        this.toastr.error('Error al actualizar transacción');
        this.isSaving.set(false);
      }
    });
  }
}
