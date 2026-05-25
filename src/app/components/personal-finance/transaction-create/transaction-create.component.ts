import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PersonalFinanceService } from '../../../services/personal-finance.service';
import { CategoryService } from '../../../services/category.service';
import { AccountService } from '../../../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Category, CategoryType } from '../../../models/category.model';
import { Account } from '../../../models/account.model';

@Component({
  selector: 'app-transaction-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './transaction-create.component.html'
})
export class TransactionCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private financeService = inject(PersonalFinanceService);
  private categoryService = inject(CategoryService);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  txnForm: FormGroup = this.fb.group({
    amount: [null, [Validators.required, Validators.min(0.01)]],
    type: ['gasto', Validators.required],
    categoryId: ['', Validators.required],
    accountId: ['', Validators.required],
    date: [new Date().toISOString().substring(0, 10), Validators.required],
    description: ['', Validators.required],
    tags: [''],
    isRecurring: [false]
  });

  isLoading = false;
  categories: Category[] = [];
  accounts: Account[] = [];

  ngOnInit() {
    this.accountService.getAccounts().subscribe(accs => this.accounts = accs);
    this.loadCategories('gasto');

    this.txnForm.get('type')?.valueChanges.subscribe(type => {
      this.loadCategories(type as CategoryType);
      this.txnForm.patchValue({ categoryId: '' });
    });
  }

  loadCategories(type: CategoryType) {
    this.categoryService.getCategories(type).subscribe(cats => this.categories = cats);
  }

  onSubmit() {
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

    const payload = {
      tipo: formValue.type,
      monto: formValue.amount,
      moneda: 'COP',
      categoriaId: formValue.categoryId,
      cuentaOrigenId: formValue.accountId || undefined,
      descripcion: formValue.description || undefined,
      fecha: formValue.date,
      tags: formValue.tags,
      esAhorro: formValue.isRecurring ?? false,
    };

    this.isLoading = true;
    this.financeService.createTransaction(payload).subscribe({
      next: () => {
        this.toastr.success('Transacción guardada');
        this.router.navigate(['/transactions']);
      },
      error: () => {
        this.toastr.error('Error al guardar');
        this.isLoading = false;
      }
    });
  }
}
