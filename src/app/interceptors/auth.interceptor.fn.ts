import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, of, Subject } from 'rxjs';
import { catchError, switchMap, filter, take, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

let isRefreshing = false;
let refreshTokenSubject: Subject<any> = new Subject<any>();

export const authInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip auth for auth endpoints
  if (req.url.includes(`${environment.apiUrl}/auth`)) {
    return next(req);
  }

  const token = authService.getAccessToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/refresh')) {
        return handle401Error(req, next, authService, router);
      }
      return throwError(() => error);
    })
  ) as Observable<HttpEvent<unknown>>;
};

function handle401Error(
  req: any,
  next: any,
  authService: AuthService,
  router: Router
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    // Try to get refresh token from cookie first (backend uses httpOnly cookies)
    const refreshToken = getCookie('refreshToken') || authService.getRefreshToken();

    if (refreshToken) {
      return authService.refreshToken().pipe(
        switchMap(() => {
          isRefreshing = false;
          const newToken = authService.getAccessToken();
          refreshTokenSubject.next(newToken);
          return next(req.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`
            }
          })) as Observable<HttpEvent<unknown>>;
        }),
        catchError((error) => {
          isRefreshing = false;
          authService.logout();
          router.navigate(['/login']);
          return throwError(() => error);
        }),
        finalize(() => {
          isRefreshing = false;
        })
      );
    } else {
      isRefreshing = false;
      authService.logout();
      router.navigate(['/login']);
      return throwError(() => new Error('No refresh token available'));
    }
  } else {
    // Si ya está refrescando, esperar a que termine y reintentar
    return refreshTokenSubject.pipe(
      take(1),
      switchMap((token) => {
        return next(req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })) as Observable<HttpEvent<unknown>>;
      })
    );
  }
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}
