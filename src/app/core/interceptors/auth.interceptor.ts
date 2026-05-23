// src/app/core/interceptors/auth.interceptor.ts — C-01 D-04 A-05
// Maneja: withCredentials para cookies, Authorization Bearer, refresh automático de token
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, switchMap, throwError, filter, take } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthStore } from '../../store/auth.store';
import { ApiResponse } from '../../models/api-response.model';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

// Flag global para evitar múltiples refreshes simultáneos
let isRefreshing = false;
// BehaviorSubject para cola de requests pendientes durante refresh
const refreshToken$ = new BehaviorSubject<string | null>(null);

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
          refreshToken$.next(null);
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
                refreshToken$.next(res.data.accessToken);
                // Reintentar la petición original con el nuevo token
                const retryReq = req.clone({
                  withCredentials: true,
                  setHeaders: { Authorization: `Bearer ${res.data.accessToken}` },
                });
                return next(retryReq);
              }),
              catchError((refreshErr) => {
                isRefreshing = false;
                refreshToken$.next(null);
                authStore.clear();
                router.navigate(['/auth/login']);
                toastr.error('Sesión expirada. Por favor inicia sesión nuevamente.');
                return throwError(() => refreshErr);
              })
            );
        } else {
          // Esperar a que el refresh existente termine y reintentar
          return refreshToken$.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(token => {
              const retryReq = req.clone({
                withCredentials: true,
                setHeaders: { Authorization: `Bearer ${token}` }
              });
              return next(retryReq);
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
