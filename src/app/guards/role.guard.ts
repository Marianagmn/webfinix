import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;
    const requiredRoles = route.data['roles'] as string[];
    const requireBusinessId = route.data['requireBusinessId'] !== false; // default true

    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    const hasRole = requiredRoles.some(role => currentUser.roles.includes(role));

    if (!hasRole) {
      this.toastr.error('No tienes los permisos necesarios para acceder a esta página.', 'Acceso denegado');
      this.router.navigate(['/dashboard']);
      return false;
    }

    // Validar businessId para rutas empresariales (business-finance)
    if (requireBusinessId && !currentUser.businessId) {
      this.toastr.warning('Debes asociar un negocio a tu cuenta para acceder a esta funcionalidad.', 'Negocio requerido');
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
