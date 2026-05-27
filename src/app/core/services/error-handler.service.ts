import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private readonly toastr: ToastrService) {}

  /**
   * Centralized HTTP error handling
   * Provides consistent error messages across the application
   */
  handleHttpError(error: HttpErrorResponse, context?: string): void {
    console.error(`HTTP Error${context ? ` in ${context}` : ''}:`, error);

    let message = 'Ocurrió un error inesperado';

    if (error.error?.message) {
      message = error.error.message;
    } else if (error.message) {
      message = error.message;
    }

    // Handle specific status codes
    switch (error.status) {
      case 0:
        message = 'No se pudo conectar al servidor. Verifica tu conexión.';
        break;
      case 400:
        message = error.error?.message || 'Solicitud inválida. Verifica los datos.';
        break;
      case 401:
        message = 'Tu sesión ha expirado. Inicia sesión nuevamente.';
        break;
      case 403:
        message = 'No tienes permiso para realizar esta acción.';
        break;
      case 404:
        message = 'El recurso solicitado no existe.';
        break;
      case 409:
        message = error.error?.message || 'Conflicto con datos existentes.';
        break;
      case 422:
        message = error.error?.message || 'Datos de validación incorrectos.';
        break;
      case 500:
        message = 'Error del servidor. Intenta nuevamente más tarde.';
        break;
      case 503:
        message = 'Servicio no disponible. Intenta nuevamente más tarde.';
        break;
    }

    this.toastr.error(message);
  }

  /**
   * Handle generic errors (non-HTTP)
   */
  handleError(error: Error, context?: string): void {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    this.toastr.error(error.message || 'Ocurrió un error inesperado');
  }

  /**
   * Handle success messages consistently
   */
  handleSuccess(message: string): void {
    this.toastr.success(message);
  }
}
