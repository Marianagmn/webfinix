// src/app/core/guards/role.guard.ts — A-03 D-07: corregido para user.roles (array)
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

    // A-03: user.roles es array — usar .some() en lugar de .includes() directo
    const hasRole = user.roles.some((r) => requiredRoles.includes(r as UserRole));
    if (hasRole) return true;

    return router.createUrlTree(['/dashboard']);
  };
