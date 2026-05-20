import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '../../store/auth.store';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const authStore = inject(AuthStore);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          authStore.clear();
          router.navigate(['/login']);
          toastr.error('Sesión expirada. Por favor inicia sesión nuevamente.');
        } else if (err.status >= 400 && err.status < 500) {
          const msg = err.error?.message || 'Ocurrió un error en la petición.';
          toastr.error(msg);
        } else if (err.status >= 500) {
          toastr.error('Error del servidor. Intenta más tarde.');
        }
      }
      return throwError(() => err);
    })
  );
};
