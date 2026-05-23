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
      },
      withCredentials: true // IMPORTANT: Send httpOnly cookies (refresh token)
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
        switchMap((response) => {
          isRefreshing = false;
          // Validate response before proceeding
          if (response && response.success && response.data) {
            const newToken = response.data.accessToken;
            refreshTokenSubject.next(newToken);
            return next(req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              },
              withCredentials: true // IMPORTANT: Send httpOnly cookies
            })) as Observable<HttpEvent<unknown>>;
          }
          // Invalid response, logout
          isRefreshing = false;
          authService.logout();
          router.navigate(['/login']);
          return throwError(() => new Error('Invalid refresh response'));
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
        if (token) {
          return next(req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true // IMPORTANT: Send httpOnly cookies
          })) as Observable<HttpEvent<unknown>>;
        }
        // No token available, logout
        authService.logout();
        router.navigate(['/login']);
        return throwError(() => new Error('No token available after refresh'));
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
