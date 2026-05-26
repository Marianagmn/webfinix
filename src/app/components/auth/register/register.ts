import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { RegisterDto } from '../../../models/auth.model';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const passwordConfirm = control.get('passwordConfirm')?.value;
  return password && passwordConfirm && password !== passwordConfirm
    ? { passwordMismatch: true }
    : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly authService = inject(AuthService);

  readonly loading = signal(false);

  passwordComplexityValidator = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    if (!password) return null;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return { passwordComplexity: true };
    }
    return null;
  };

  readonly registerForm = this.fb.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
    },
    { validators: [passwordMatchValidator, this.passwordComplexityValidator] }
  );

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toastr.error('Por favor completa todos los campos correctamente');
      return;
    }

    this.loading.set(true);
    const payload = this.registerForm.value as RegisterDto;

    this.authService.register(payload).subscribe({
      next: (response: any) => {
        this.loading.set(false);
        if (response.success) {
          this.toastr.success('Registro exitoso');
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error(response.message || 'No se pudo completar el registro.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        const message =
          (err.error as any)?.message ||
          (err.error as any)?.data?.message ||
          err.message ||
          'No se pudo completar el registro.';
        console.error('Registration error:', err);
        this.toastr.error(message);
      },
    });
  }
}

