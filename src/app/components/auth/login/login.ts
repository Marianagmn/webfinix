import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { LoginDto } from '../../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly authService = inject(AuthService);

  readonly loading = signal(false);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const credentials = this.loginForm.value as LoginDto;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success) {
          this.toastr.success('Inicio de sesión exitoso');
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error(response.message || 'No se pudo iniciar sesión.');
        }
      },
      error: () => {
        this.loading.set(false);
        this.toastr.error('No se pudo iniciar sesión.');
      },
    });
  }
}

