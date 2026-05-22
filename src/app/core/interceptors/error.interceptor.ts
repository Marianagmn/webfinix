// src/app/core/interceptors/error.interceptor.ts — M-03: ya no redirige al login en 401 sin intentar refresh
// El authInterceptor maneja el refresh; este interceptor solo loguea errores no-401
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((err: unknown) => {
      // authInterceptor ya maneja 401 — aquí solo cubrimos casos no manejados
      if (err instanceof HttpErrorResponse && err.status !== 401) {
        if (err.status >= 400 && err.status < 500) {
          const msg = (err.error as any)?.message || 'Error en la petición.';
          toastr.error(msg);
        } else if (err.status >= 500) {
          toastr.error('Error del servidor. Intenta más tarde.');
        }
      }
      return throwError(() => err);
    })
  );
};
