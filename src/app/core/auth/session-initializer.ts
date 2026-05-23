// src/app/core/auth/session-initializer.ts
// APP_INITIALIZER for restoring user session on app bootstrap

import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AuthStore } from '../../store/auth.store';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Session restore initializer
 * Attempts to restore user session on app bootstrap using refresh token
 * 
 * This ensures that when a user refreshes the page or returns to the app,
 * their session is automatically restored if they have a valid refresh token
 */
export const sessionInitializer = () => {
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);

  // Only attempt restore if we don't already have a user in the store
  if (authStore.isAuthenticated()) {
    return Promise.resolve();
  }

  // Attempt to refresh tokens using the httpOnly cookie
  return firstValueFrom(
    authService.refreshToken().pipe(
      catchError((error) => {
        // If refresh fails (expired, invalid, etc.), clear any stale data
        authStore.clear();
        // Don't block app startup - just continue as unauthenticated
        return of(null);
      })
    )
  ).catch(() => {
    // Handle any unexpected errors without blocking app startup
    authStore.clear();
    return Promise.resolve();
  });
};
