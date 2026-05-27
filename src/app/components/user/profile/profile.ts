import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../../services/user.service';
import { AuthStore } from '../../../store/auth.store';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly authStore = inject(AuthStore);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly businessRequiredMessage = signal<string | null>(null);

  profileForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    businessId: [''],
  });

  ngOnInit(): void {
    // Check for business_required query param from guard
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
      if (params['message'] === 'business_required') {
        this.businessRequiredMessage.set('Necesitas configurar una empresa para acceder a las funciones de finanzas empresariales.');
      }
    });

    this.isLoading.set(true);
    
    this.userService.getMe()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
      next: (user: User) => {
        this.profileForm.patchValue({
          name: user.name || '',
          email: user.email || '',
          businessId: user.businessId || '',
        });
      },
      error: (err) => {
        this.errorHandler.handleHttpError(err, 'Profile - load user');
      },
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.userService.updateMe(this.profileForm.value)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isSaving.set(false);
        })
      )
      .subscribe({
      next: (user: User) => {
        this.errorHandler.handleSuccess('Perfil actualizado');
        this.authStore.setUser(user);
      },
      error: (err) => {
        this.errorHandler.handleHttpError(err, 'Profile - update user');
      },
    });
  }
}
