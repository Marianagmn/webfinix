// src/app/core/guards/business.guard.ts
// Guard para validar que el usuario tenga businessId antes de acceder a rutas empresariales
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { ToastrService } from 'ngx-toastr';

/**
 * Guard que verifica si el usuario tiene businessId configurado
 * Requerido para acceder al módulo de business-finance
 * 
 * Uso en rutas:
 * {
 *   path: 'business-finance',
 *   canActivate: [authGuard, businessGuard],
 *   loadChildren: () => import('./features/business-finance/business-finance.routes')
 * }
 */
export const businessGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  
  const user = authStore.user();
  
  // Validar que user esté autenticado
  if (!user) {
    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
  }
  
  // Validar que user tenga businessId
  if (!user.businessId) {
    toastr.warning(
      'Configura tu negocio en el perfil para acceder a finanzas empresariales',
      'Negocio no configurado'
    );
    
    return router.createUrlTree(['/user/profile'], {
      queryParams: {
        tab: 'business',
        message: 'setup_business_required'
      }
    });
  }
  
  return true;
};
