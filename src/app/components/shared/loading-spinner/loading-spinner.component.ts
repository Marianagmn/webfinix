import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex justify-content-center align-items-center flex-column p-4">
      <div class="spinner-border text-primary" role="status" [style.width.px]="size" [style.height.px]="size">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3 text-muted" *ngIf="message">{{ message }}</p>
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Cargando...';
  @Input() size: number = 40;
}
