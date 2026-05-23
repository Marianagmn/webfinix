import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
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
      this.router.navigate(['/dashboard']);
      return false;
    }

    // Validar businessId para rutas empresariales (business-finance)
    if (requireBusinessId && !currentUser.businessId) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
