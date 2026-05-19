import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './account-create.component.html'
})
export class AccountCreateComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  accountForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    tipo: ['ahorro', Validators.required],
    moneda: ['COP', Validators.required],
    balance: [0, Validators.required]
  });

  isLoading = false;

  onSubmit() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.accountService.createAccount(this.accountForm.value).subscribe({
      next: () => {
        this.toastr.success('Cuenta creada exitosamente');
        this.router.navigate(['/accounts']);
      },
      error: () => {
        this.toastr.error('Error al crear la cuenta');
        this.isLoading = false;
      }
    });
  }
}
