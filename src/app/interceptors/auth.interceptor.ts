import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  
  const token = authService.getToken();

  let modifiedReq = req;
  
  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
    modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.removeToken();
        router.navigate(['/login']);
        toastr.error('Tu sesión ha expirado, por favor ingresa de nuevo.', 'No autorizado');
      } else if (error.status === 403) {
        toastr.warning('No tienes permisos suficientes para realizar esta acción.', 'Acceso denegado');
      } else if (error.status === 500) {
        toastr.error('Ocurrió un error en el servidor.', 'Error');
      }
      return throwError(() => error);
    })
  );
};
