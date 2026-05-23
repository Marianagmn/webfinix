// src/app/core/interceptors/auth.interceptor.ts — C-01 D-04
// Maneja: withCredentials para cookies, Authorization Bearer, refresh automático de token
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthStore } from '../../store/auth.store';
import { ApiResponse } from '../../models/api-response.model';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

// Flag global para evitar múltiples refreshes simultáneos
let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const http = inject(HttpClient);

  const token = authStore.token();

  // C-01: withCredentials en TODAS las requests → las cookies httpOnly viajan automáticamente
  const authReq = req.clone({
    withCredentials: true,
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return next(authReq).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse)) {
        return throwError(() => err);
      }

      if (err.status === 401) {
        // No intentar refresh si ya estamos en /auth/ o en /refresh
        if (req.url.includes('/auth/')) {
          authStore.clear();
          router.navigate(['/auth/login']);
          return throwError(() => err);
        }

        if (!isRefreshing) {
          isRefreshing = true;
          // C-01: El refreshToken está en cookie httpOnly — solo enviamos body vacío con withCredentials
          return http
            .post<ApiResponse<{ accessToken: string; user: User }>>(
              `${environment.apiUrl}/auth/refresh`,
              {},
              { withCredentials: true }
            )
            .pipe(
              switchMap((res) => {
                isRefreshing = false;
                authStore.setToken(res.data.accessToken);
                authStore.setUser(res.data.user);
                // Reintentar la petición original con el nuevo token
                const retryReq = req.clone({
                  withCredentials: true,
                  setHeaders: { Authorization: `Bearer ${res.data.accessToken}` },
                });
                return next(retryReq);
              }),
              catchError((refreshErr) => {
                isRefreshing = false;
                authStore.clear();
                router.navigate(['/auth/login']);
                toastr.error('Sesión expirada. Por favor inicia sesión nuevamente.');
                return throwError(() => refreshErr);
              })
            );
        }
      }

      if (err.status >= 400 && err.status < 500 && err.status !== 401) {
        const msg = (err.error as any)?.message || 'Error en la petición.';
        toastr.error(msg);
      } else if (err.status >= 500) {
        toastr.error('Error del servidor. Intenta más tarde.');
      }

      return throwError(() => err);
    })
  );
};
