// src/app/core/utils/destroy.util.ts
// PHASE 5 FIX: Memory leak prevention utility
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

/**
 * Utility for preventing memory leaks in components
 * Usage: pipe(takeUntilDestroyed(this))
 */
export { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Helper to safely subscribe with automatic cleanup
 */
export function safeSubscribe<T>(
  observable: Observable<T>,
  next: (value: T) => void,
  error?: (error: any) => void,
  complete?: () => void
): void {
  observable.pipe(takeUntilDestroyed()).subscribe({
    next,
    error,
    complete,
  });
}
