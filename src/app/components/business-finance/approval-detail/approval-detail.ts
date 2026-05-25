import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BusinessFinanceService } from '../../../services/business-finance.service';
import { BusinessFinance } from '../../../models/business-finance.model';

@Component({
  selector: 'app-approval-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './approval-detail.html',
  styleUrl: './approval-detail.css',
})
export class ApprovalDetail implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(BusinessFinanceService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(true);
  readonly isProcessing = signal(false);
  readonly transaction = signal<BusinessFinance | null>(null);
  readonly transactionId = signal<string>('');

  commentForm: FormGroup = this.fb.group({
    comentario: ['', Validators.maxLength(500)],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastr.error('ID de transacción no proporcionado');
      this.router.navigate(['/business-finance/approvals']);
      return;
    }

    this.transactionId.set(id);
    this.loadTransaction();
  }

  loadTransaction(): void {
    this.service.getTransactionById(this.transactionId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.transaction.set(res.data);
          this.isLoading.set(false);
        },
        error: () => {
          this.toastr.error('Error al cargar transacción');
          this.router.navigate(['/business-finance/approvals']);
        },
      });
  }

  approve(): void {
    this.isProcessing.set(true);
    const comentario = this.commentForm.value.comentario;

    this.service.approve(this.transactionId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastr.success('Transacción aprobada');
          this.router.navigate(['/business-finance/approvals']);
        },
        error: () => {
          this.toastr.error('Error al aprobar transacción');
          this.isProcessing.set(false);
        },
      });
  }

  reject(): void {
    this.isProcessing.set(true);
    const motivo = this.commentForm.value.comentario || 'Sin motivo especificado';

    this.service.reject(this.transactionId(), motivo)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastr.success('Transacción rechazada');
          this.router.navigate(['/business-finance/approvals']);
        },
        error: () => {
          this.toastr.error('Error al rechazar transacción');
          this.isProcessing.set(false);
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/business-finance/approvals']);
  }
}
