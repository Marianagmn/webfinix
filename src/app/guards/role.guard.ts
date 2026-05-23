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

    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    const hasRole = requiredRoles.some(role => currentUser.roles.includes(role));
    
    if (!hasRole) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
