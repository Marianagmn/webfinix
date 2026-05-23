// src/app/features/business-finance/components/approval-workflow/approval-workflow.component.ts
// PHASE 4 FIX: Complete business-finance approval workflow UI
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { BusinessFinanceApprovalService } from '../../../../services/business-finance/business-finance-approval.service';
import { BusinessFinance } from '../../../../models/transaction.model';

@Component({
  selector: 'app-approval-workflow',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="approval-workflow">
      <div class="workflow-header">
        <h3>Approval Workflow</h3>
        <span class="status-badge" [class]="getStatusClass()">
          {{ transaction?.estado || 'Unknown' }}
        </span>
      </div>

      <div class="approval-steps">
        <div *ngFor="let step of approvalSteps" class="approval-step" [class.completed]="step.estado === 'aprobado'" [class.pending]="step.estado === 'pendiente'" [class.rejected]="step.estado === 'rechazado'">
          <div class="step-indicator">
            <span class="step-number">{{ step.nivel }}</span>
            <span class="step-icon">
              <span *ngIf="step.estado === 'aprobado'">✓</span>
              <span *ngIf="step.estado === 'pendiente'">⏳</span>
              <span *ngIf="step.estado === 'rechazado'">✗</span>
            </span>
          </div>
          <div class="step-details">
            <div class="step-role">{{ step.rol || 'Level ' + step.nivel }}</div>
            <div *ngIf="step.comentario" class="step-comment">{{ step.comentario }}</div>
            <div *ngIf="step.fecha" class="step-date">{{ step.fecha | date:'short' }}</div>
          </div>
        </div>
      </div>

      <div class="workflow-actions" *ngIf="canApprove || canReject">
        <button (click)="approve()" [disabled]="approving" class="btn-approve">
          {{ approving ? 'Approving...' : 'Approve' }}
        </button>
        <button (click)="reject()" [disabled]="rejecting" class="btn-reject">
          {{ rejecting ? 'Rejecting...' : 'Reject' }}
        </button>
      </div>
    </div>
  `,
  styles: `
    .approval-workflow {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .workflow-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .workflow-header h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-badge.aprobada { background: #d1fae5; color: #065f46; }
    .status-badge.pendiente { background: #fef3c7; color: #92400e; }
    .status-badge.rechazada { background: #fee2e2; color: #991b1b; }

    .approval-steps {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .approval-step {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-radius: 0.375rem;
      border: 1px solid #e5e7eb;
    }

    .approval-step.completed {
      background: #f0fdf4;
      border-color: #86efac;
    }

    .approval-step.pending {
      background: #fffbeb;
      border-color: #fcd34d;
    }

    .approval-step.rejected {
      background: #fef2f2;
      border-color: #fca5a5;
    }

    .step-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .step-number {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .step-icon {
      font-size: 1.25rem;
    }

    .step-details {
      flex: 1;
    }

    .step-role {
      font-weight: 500;
      color: #111827;
    }

    .step-comment {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    .step-date {
      font-size: 0.75rem;
      color: #9ca3af;
      margin-top: 0.25rem;
    }

    .workflow-actions {
      display: flex;
      gap: 0.75rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn-approve, .btn-reject {
      flex: 1;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .btn-approve {
      background: #10b981;
      color: white;
    }

    .btn-approve:hover:not(:disabled) {
      background: #059669;
    }

    .btn-reject {
      background: #ef4444;
      color: white;
    }

    .btn-reject:hover:not(:disabled) {
      background: #dc2626;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `,
})
export class ApprovalWorkflowComponent {
  @Input() transaction: BusinessFinance | null = null;
  @Input() currentUserId: string = '';
  @Output() approved = new EventEmitter<void>();
  @Output() rejected = new EventEmitter<void>();

  approving = false;
  rejecting = false;

  constructor(private approvalService: BusinessFinanceApprovalService) {}

  get approvalSteps() {
    return this.transaction?.cadenaAprobacion || [];
  }

  get canApprove() {
    return this.transaction?.estado === 'pendiente' && this.isCurrentApprover();
  }

  get canReject() {
    return this.transaction?.estado === 'pendiente' && this.isCurrentApprover();
  }

  isCurrentApprover(): boolean {
    const currentStep = this.approvalSteps.find(
      step => step.estado === 'pendiente'
    );
    return currentStep?.aprobadorId === this.currentUserId;
  }

  getStatusClass(): string {
    const status = this.transaction?.estado || '';
    return status.toLowerCase();
  }

  async approve(): Promise<void> {
    if (!this.transaction?.id) return;

    this.approving = true;
    try {
      await firstValueFrom(
        this.approvalService.approve(this.transaction.id, 'Approved by user')
      );
      this.approved.emit();
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      this.approving = false;
    }
  }

  async reject(): Promise<void> {
    if (!this.transaction?.id) return;

    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    this.rejecting = true;
    try {
      await firstValueFrom(
        this.approvalService.reject(this.transaction.id, reason)
      );
      this.rejected.emit();
    } catch (error) {
      console.error('Rejection failed:', error);
    } finally {
      this.rejecting = false;
    }
  }
}
