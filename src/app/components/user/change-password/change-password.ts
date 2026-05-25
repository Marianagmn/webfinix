import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly toastr = inject(ToastrService);

  readonly isSaving = signal(false);

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    passwordConfirm: ['', [Validators.required]],
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(form: FormGroup): any {
    return form.get('newPassword')?.value === form.get('passwordConfirm')?.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const raw = this.passwordForm.value;
    const payload = {
      currentPassword: raw.currentPassword,
      newPassword: raw.newPassword,
      newPasswordConfirm: raw.passwordConfirm,
    };

    this.isSaving.set(true);
    this.userService.changePassword(payload).subscribe({
      next: () => {
        this.toastr.success('Contraseña cambiada exitosamente');
        this.passwordForm.reset();
        this.isSaving.set(false);
      },
      error: () => {
        this.toastr.error('Error al cambiar contraseña');
        this.isSaving.set(false);
      },
    });
  }
}
