import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado';

      // Skip error handling for auth endpoints to avoid conflicts
      if (req.url.includes(`${environment.apiUrl}/auth`)) {
        return throwError(() => error);
      }

      // Mapear códigos de error específicos del backend
      if (error.error?.code) {
        switch (error.error.code) {
          case 'TOO_MANY_REQUESTS':
            errorMessage = 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.';
            break;
          case 'ANALYSIS_ERROR':
            errorMessage = 'Error en el análisis financiero. Verifica los datos.';
            break;
          case 'PREDICTION_ERROR':
            errorMessage = 'Error en la predicción. No hay suficientes datos.';
            break;
          case 'SIMULATION_ERROR':
            errorMessage = 'Error en la simulación. Verifica los parámetros.';
            break;
          case 'NOT_FOUND':
            errorMessage = 'Recurso no encontrado.';
            break;
          case 'FORBIDDEN':
            errorMessage = 'No tienes permisos para esta acción.';
            break;
          default:
            errorMessage = error.error.message || errorMessage;
        }
      } else if (error.status === 401) {
        errorMessage = 'No autorizado. Inicia sesión nuevamente.';
        // REMOVED: router.navigate(['/login']);
        // Auth interceptor already handles 401 and navigation to login
        // This prevents double navigation and race conditions
      } else if (error.status === 403) {
        errorMessage = 'No tienes permisos para esta acción.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado.';
      } else if (error.status === 409) {
        errorMessage = 'Conflicto de datos. El recurso ya existe.';
      } else if (error.status === 422) {
        errorMessage = 'Datos inválidos. Verifica la información.';
      } else if (error.status === 429) {
        errorMessage = 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.';
      } else if (error.status === 500) {
        errorMessage = 'Error del servidor. Contacta al soporte.';
      } else if (error.status === 503) {
        errorMessage = 'Servicio no disponible. Intenta nuevamente más tarde.';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }

      toastr.error(errorMessage, 'Error');
      return throwError(() => error);
    })
  );
};
