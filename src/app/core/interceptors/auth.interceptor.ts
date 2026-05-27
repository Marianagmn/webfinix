// src/app/core/interceptors/auth.interceptor.ts — C-01 D-04 A-05
// Maneja: withCredentials para cookies, Authorization Bearer, refresh automático de token, CSRF token
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, switchMap, throwError, filter, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthStore } from '../../store/auth.store';
import { ApiResponse } from '../../models/api-response.model';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

// Función auxiliar para leer el token CSRF de la cookie
function getCsrfToken(): string | null {
  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrf-token') {
        return decodeURIComponent(value);
      }
    }
  } catch (e) {
    // Si hay error al acceder a cookies, retornar null
  }
  return null;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const http = inject(HttpClient);

  const token = authStore.token();
  const csrfToken = getCsrfToken();

  // Métodos que requieren CSRF token
  const needsCsrf = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);

  // C-01: withCredentials en TODAS las requests → las cookies httpOnly viajan automáticamente
  const authReq = req.clone({
    withCredentials: true,
    setHeaders: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(csrfToken && needsCsrf ? { 'x-csrf-token': csrfToken } : {}),
    },
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

        if (!authStore.isRefreshing()) {
          authStore.setRefreshing(true);
          authStore.setRefreshToken(null);
          // C-01: El refreshToken está en cookie httpOnly — solo enviamos body vacío con withCredentials
          return http
            .post<ApiResponse<{ accessToken: string; user: User }>>(
              `${environment.apiUrl}/auth/refresh`,
              {},
              { 
                withCredentials: true,
                headers: csrfToken ? { 'x-csrf-token': csrfToken } : {}
              }
            )
            .pipe(
              switchMap((res) => {
                authStore.setRefreshing(false);
                authStore.setToken(res.data.accessToken);
                authStore.setUser(res.data.user);
                authStore.setRefreshToken(res.data.accessToken);
                // Reintentar la petición original con el nuevo token
                const freshCsrfToken = getCsrfToken();
                const retryReq = req.clone({
                  withCredentials: true,
                  setHeaders: { 
                    Authorization: `Bearer ${res.data.accessToken}`,
                    ...(freshCsrfToken && needsCsrf ? { 'x-csrf-token': freshCsrfToken } : {}),
                  },
                });
                return next(retryReq);
              }),
              catchError((refreshErr) => {
                authStore.setRefreshing(false);
                authStore.setRefreshToken(null);
                authStore.clear();
                router.navigate(['/auth/login']);
                toastr.error('Sesión expirada. Por favor inicia sesión nuevamente.');
                return throwError(() => refreshErr);
              })
            );
        } else {
          // Esperar a que el refresh existente termine y reintentar
          return authStore.refreshToken$.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(token => {
              const freshCsrfToken = getCsrfToken();
              const retryReq = req.clone({
                withCredentials: true,
                setHeaders: { 
                  Authorization: `Bearer ${token}`,
                  ...(freshCsrfToken && needsCsrf ? { 'x-csrf-token': freshCsrfToken } : {}),
                }
              });
              return next(retryReq);
            })
          );
        }
      }

      // 4xx and 5xx errors are handled by error.interceptor.ts
      return throwError(() => err);
    })
  );
};
