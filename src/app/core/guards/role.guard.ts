import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { UserRole } from '../../models/user.model';

export const roleGuard = (...requiredRoles: UserRole[]): CanActivateFn =>
  () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    const user = authStore.user();
    if (!user) return router.createUrlTree(['/auth/login']);
    if (requiredRoles.length === 0) return true;
    if (requiredRoles.includes(user.role)) return true;
    return router.createUrlTree(['/dashboard']);
  };
