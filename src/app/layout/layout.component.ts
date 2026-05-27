import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
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
export class LayoutComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  // Start collapsed on mobile so it doesn't block content on load
  readonly sidebarOpen = signal(window.innerWidth > 768);

  ngOnInit(): void {
    // Also close sidebar on navigation on mobile
    this.router.events.subscribe(() => {
      if (window.innerWidth <= 768) {
        this.sidebarOpen.set(false);
      }
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    // Auto-open on desktop, auto-close on mobile when resizing
    if (window.innerWidth > 768) {
      this.sidebarOpen.set(true);
    } else {
      this.sidebarOpen.set(false);
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  /** Called when user taps the dark overlay on mobile */
  closeSidebar(): void {
    this.sidebarOpen.set(false);
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
