import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthStore } from '../../../store/auth.store';
import { ToastrService } from 'ngx-toastr';
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
  private readonly toastr = inject(ToastrService);
  private readonly route = inject(ActivatedRoute);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly businessRequiredMessage = signal<string | null>(null);

  profileForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    // Check for business_required query param from guard
    this.route.queryParams.subscribe(params => {
      if (params['message'] === 'business_required') {
        this.businessRequiredMessage.set('Necesitas configurar una empresa para acceder a las funciones de finanzas empresariales.');
      }
    });

    this.userService.getMe().subscribe({
      next: (user: User) => {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        const message = (err.error as any)?.message || err.message || 'Error al cargar perfil';
        console.error('Profile load error:', err);
        this.toastr.error(message);
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.userService.updateMe(this.profileForm.value).subscribe({
      next: (user: User) => {
        this.toastr.success('Perfil actualizado');
        this.authStore.setUser(user);
        this.isSaving.set(false);
      },
      error: () => {
        this.toastr.error('Error al actualizar perfil');
        this.isSaving.set(false);
      },
    });
  }
}
