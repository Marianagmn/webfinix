import { Injectable, inject } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class OptimisticUpdateService {
  private readonly toastr = inject(ToastrService);
  private rollback$ = new Subject<{ key: string; value: any }>();

  /**
   * Ejecuta una actualización optimista
   * @param key - Clave única para identificar la actualización
   * @param optimisticAction - Acción optimista (actualizar UI inmediatamente)
   * @param serverAction - Acción del servidor
   * @param rollbackAction - Acción de rollback si falla
   * @returns Observable del resultado del servidor
   */
  executeOptimistic<T>(
    key: string,
    optimisticAction: () => void,
    serverAction: Observable<T>,
    rollbackAction: () => void
  ): Observable<T> {
    // Ejecutar acción optimista
    optimisticAction();

    // Ejecutar acción del servidor
    return serverAction.pipe(
      tap(() => {
        // Éxito - la acción optimista fue correcta
      }),
      catchError((error) => {
        // Error - hacer rollback
        rollbackAction();
        this.toastr.error('Error al guardar cambios. Reintentando...');
        throw error;
      })
    );
  }

  /**
   * Ejecuta una actualización optimista para listas
   * @param items - Lista actual
   * @ itemId - ID del item a actualizar
   * @param updateFn - Función de actualización optimista
   * @param serverAction - Acción del servidor
   * @returns Observable del resultado del servidor
   */
  executeOptimisticList<T>(
    items: T[],
    itemId: string,
    updateFn: (items: T[]) => void,
    serverAction: Observable<T>
  ): Observable<T> {
    // Guardar estado original para rollback
    const originalItems = [...items];

    // Ejecutar actualización optimista
    updateFn(items);

    // Ejecutar acción del servidor
    return serverAction.pipe(
      tap(() => {
        // Éxito
      }),
      catchError((error) => {
        // Error - rollback
        items.splice(0, items.length, ...originalItems);
        this.toastr.error('Error al guardar cambios');
        throw error;
      })
    );
  }
}
