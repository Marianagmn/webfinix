import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './account-edit.component.html'
})
export class AccountEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  accountForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    tipo: ['ahorro', Validators.required],
    moneda: ['COP', Validators.required],
    balance: [0, Validators.required]
  });

  isLoading = false;
  accountId = '';

  ngOnInit() {
    this.accountId = this.route.snapshot.paramMap.get('id') || '';
    if (this.accountId) {
      this.loadAccount();
    }
  }

  loadAccount() {
    this.accountService.getAccountById(this.accountId).subscribe({
      next: (account) => {
        this.accountForm.patchValue({
          nombre: account.nombre,
          tipo: account.tipo,
          moneda: account.moneda,
          balance: account.balance
        });
      },
      error: () => {
        this.toastr.error('Error al cargar la cuenta');
        this.router.navigate(['/accounts']);
      }
    });
  }

  onSubmit() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.accountService.updateAccount(this.accountId, this.accountForm.value).subscribe({
      next: () => {
        this.toastr.success('Cuenta actualizada exitosamente');
        this.router.navigate(['/accounts']);
      },
      error: () => {
        this.toastr.error('Error al actualizar la cuenta');
        this.isLoading = false;
      }
    });
  }
}
