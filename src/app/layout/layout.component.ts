import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  readonly sidebarOpen = signal(true);

  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.toastr.success('Cierre de sesión realizado');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.toastr.error('No se pudo cerrar la sesión');
      },
    });
  }
}
