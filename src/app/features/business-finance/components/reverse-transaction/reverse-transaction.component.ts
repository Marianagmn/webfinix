// src/app/features/business-finance/components/reverse-transaction/reverse-transaction.component.ts
// PHASE 4 FIX: Reverse transaction workflow UI
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { BusinessFinanceAccountingService } from '../../../../services/business-finance/business-finance-accounting.service';
import { BusinessFinance } from '../../../../models/transaction.model';

@Component({
  selector: 'app-reverse-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reverse-transaction">
      <h3>Reverse Transaction</h3>
      <p class="warning-text">
        ⚠️ This action will create a reversal transaction. This cannot be undone.
      </p>

      <div class="transaction-info" *ngIf="transaction">
        <div class="info-row">
          <span class="label">Transaction ID:</span>
          <span class="value">{{ transaction.id }}</span>
        </div>
        <div class="info-row">
          <span class="label">Amount:</span>
          <span class="value">{{ transaction.monto | currency }}</span>
        </div>
        <div class="info-row">
          <span class="label">Description:</span>
          <span class="value">{{ transaction.descripcion }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="reason">Reason for reversal *</label>
        <textarea
          id="reason"
          [(ngModel)]="reason"
          placeholder="Please provide a detailed reason for this reversal"
          rows="4"
          required
        ></textarea>
      </div>

      <div class="actions">
        <button (click)="cancel()" class="btn-cancel">Cancel</button>
        <button
          (click)="confirmReverse()"
          [disabled]="!reason || reversing"
          class="btn-reverse"
        >
          {{ reversing ? 'Processing...' : 'Confirm Reversal' }}
        </button>
      </div>
    </div>
  `,
  styles: `
    .reverse-transaction {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    h3 {
      margin: 0 0 1rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
    }

    .warning-text {
      background: #fef2f2;
      color: #991b1b;
      padding: 0.75rem;
      border-radius: 0.375rem;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
    }

    .transaction-info {
      background: #f9fafb;
      padding: 1rem;
      border-radius: 0.375rem;
      margin-bottom: 1.5rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: 500;
      color: #6b7280;
    }

    .value {
      color: #111827;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .form-group textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-family: inherit;
      font-size: 0.875rem;
      resize: vertical;
    }

    .form-group textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }

    .btn-cancel, .btn-reverse {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .btn-cancel {
      background: #e5e7eb;
      color: #374151;
    }

    .btn-cancel:hover {
      background: #d1d5db;
    }

    .btn-reverse {
      background: #ef4444;
      color: white;
    }

    .btn-reverse:hover:not(:disabled) {
      background: #dc2626;
    }

    .btn-reverse:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `,
})
export class ReverseTransactionComponent {
  @Input() transaction: BusinessFinance | null = null;
  @Output() reversed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  reason = '';
  reversing = false;

  constructor(private accountingService: BusinessFinanceAccountingService) {}

  cancel(): void {
    this.cancelled.emit();
  }

  async confirmReverse(): Promise<void> {
    if (!this.transaction?.id || !this.reason.trim()) return;

    this.reversing = true;
    try {
      await firstValueFrom(
        this.accountingService.reverse(this.transaction.id, this.reason)
      );
      this.reversed.emit();
    } catch (error) {
      console.error('Reversal failed:', error);
    } finally {
      this.reversing = false;
    }
  }
}
