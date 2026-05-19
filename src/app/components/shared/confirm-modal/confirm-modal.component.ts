import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal fade show" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5);" *ngIf="isOpen">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-bottom-0">
            <h5 class="modal-title fw-bold text-dark">{{ title }}</h5>
            <button type="button" class="btn-close" (click)="cancel()"></button>
          </div>
          <div class="modal-body">
            <p>{{ message }}</p>
          </div>
          <div class="modal-footer border-top-0">
            <button type="button" class="btn btn-light" (click)="cancel()">Cancelar</button>
            <button type="button" class="btn btn-danger" (click)="confirm()">Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModalComponent {
  @Input() title: string = 'Confirmar Acción';
  @Input() message: string = '¿Estás seguro de que deseas continuar?';
  @Input() isOpen: boolean = false;
  
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  confirm() {
    this.onConfirm.emit();
  }

  cancel() {
    this.isOpen = false;
    this.onCancel.emit();
  }
}
