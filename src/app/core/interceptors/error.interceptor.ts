// src/app/core/interceptors/error.interceptor.ts — Mejorado con mensajes específicos por código de error
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        // 401 es manejado por authInterceptor
        if (err.status === 401) {
          return throwError(() => err);
        }

        // 403 Forbidden - manejar diferentes casos
        if (err.status === 403) {
          const errorCode = (err.error as any)?.code;
          if (errorCode === 'REQUIRES_BUSINESS_ID') {
            toastr.error('Se requiere configuración de negocio para acceder');
            router.navigate(['/user/profile'], { queryParams: { message: 'business_required' } });
          } else if (errorCode === 'INSUFFICIENT_ROLE') {
            toastr.error('No tienes permisos suficientes para esta acción');
          } else {
            const msg = (err.error as any)?.message || 'Acceso denegado';
            toastr.error(msg);
          }
          return throwError(() => err);
        }

        // 400 Bad Request - errores de validación
        if (err.status === 400) {
          const msg = (err.error as any)?.message || 'Datos inválidos. Por favor verifica tu información.';
          toastr.error(msg);
          return throwError(() => err);
        }

        // 404 Not Found
        if (err.status === 404) {
          const msg = (err.error as any)?.message || 'Recurso no encontrado';
          toastr.error(msg);
          return throwError(() => err);
        }

        // 409 Conflict - duplicados, conflictos
        if (err.status === 409) {
          const msg = (err.error as any)?.message || 'Conflicto de datos. El recurso ya existe.';
          toastr.error(msg);
          return throwError(() => err);
        }

        // 429 Too Many Requests - rate limiting
        if (err.status === 429) {
          toastr.error('Demasiadas solicitudes. Por favor espera unos minutos.');
          return throwError(() => err);
        }

        // 500+ Server errors
        if (err.status >= 500) {
          toastr.error('Error del servidor. Por favor intenta más tarde.');
          return throwError(() => err);
        }

        // Otros errores 4xx
        if (err.status >= 400 && err.status < 500) {
          const msg = (err.error as any)?.message || 'Error en la petición.';
          toastr.error(msg);
          return throwError(() => err);
        }
      }

      return throwError(() => err);
    })
  );
};
