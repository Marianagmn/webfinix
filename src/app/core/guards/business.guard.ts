// src/app/core/guards/business.guard.ts
// Guard para validar que el usuario tenga businessId antes de acceder a rutas empresariales
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';

export const businessGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  
  const user = authStore.user();
  if (!user?.businessId) {
    return router.createUrlTree(['/user/profile'], {
      queryParams: {
        message: 'business_required'
      }
    });
  }
  return true;
};
