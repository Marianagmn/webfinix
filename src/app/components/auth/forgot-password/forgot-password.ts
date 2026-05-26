import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);

  readonly isLoading = signal(false);
  readonly isResetMode = signal(false);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  resetForm: FormGroup = this.fb.group({
    token: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirm: ['', Validators.required],
  });

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.isResetMode.set(true);
      this.resetForm.patchValue({ token });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.forgotPassword(this.form.value.email).subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'Si el email existe, recibirás instrucciones');
        this.isLoading.set(false);
        this.form.reset();
      },
      error: () => {
        this.toastr.error('Error al procesar la solicitud');
        this.isLoading.set(false);
      },
    });
  }

  onResetSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const { password, passwordConfirm } = this.resetForm.value;
    if (password !== passwordConfirm) {
      this.toastr.error('Las contraseñas no coinciden');
      return;
    }

    this.isLoading.set(true);

    this.authService.resetPassword(this.resetForm.value.token, password).subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'Contraseña restablecida exitosamente');
        this.isLoading.set(false);
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.toastr.error('Token inválido o expirado');
        this.isLoading.set(false);
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
