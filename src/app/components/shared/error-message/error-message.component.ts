import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert" [ngClass]="'alert-' + type" role="alert">
      <i class="bi me-2" [ngClass]="{
        'bi-exclamation-triangle-fill': type === 'warning',
        'bi-x-circle-fill': type === 'danger',
        'bi-info-circle-fill': type === 'info'
      }"></i>
      {{ message }}
    </div>
  `
})
export class ErrorMessageComponent {
  @Input() message: string = 'Ha ocurrido un error.';
  @Input() type: 'danger' | 'warning' | 'info' = 'danger';
}
