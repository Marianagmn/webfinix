import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user';
import { AuthService } from '../../../services/auth.service';
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
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);

  profileForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (response: any) => {
        this.profileForm.patchValue({
          name: response.data.name,
          email: response.data.email,
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.toastr.error('Error al cargar perfil');
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
      next: (response: any) => {
        this.toastr.success('Perfil actualizado');
        this.authService.getProfile().subscribe();
        this.isSaving.set(false);
      },
      error: () => {
        this.toastr.error('Error al actualizar perfil');
        this.isSaving.set(false);
      },
    });
  }
}
