import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BusinessFinanceService } from '../../../services/business-finance.service';
import { BusinessFinance } from '../../../models/transaction.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-business-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './business-list.component.html'
})
export class BusinessListComponent implements OnInit {
  private businessService = inject(BusinessFinanceService);
  private toastr = inject(ToastrService);

  transactions: BusinessFinance[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.isLoading = true;
    this.businessService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Error al cargar transacciones empresariales');
        this.isLoading = false;
      }
    });
  }

  submitForApproval(id: string) {
    this.businessService.submitForApproval(id).subscribe({
      next: () => {
        this.toastr.success('Enviado a aprobación');
        this.loadTransactions();
      },
      error: () => this.toastr.error('Error al enviar a aprobación')
    });
  }

  postTransaction(id: string) {
    this.businessService.post(id).subscribe({
      next: () => {
        this.toastr.success('Transacción contabilizada');
        this.loadTransactions();
      },
      error: () => this.toastr.error('Error al contabilizar')
    });
  }

  deleteTransaction(id: string) {
    if(confirm('¿Eliminar transacción empresarial?')) {
      this.businessService.deleteTransaction(id).subscribe({
        next: () => {
          this.toastr.success('Transacción eliminada');
          this.loadTransactions();
        },
        error: () => this.toastr.error('Error al eliminar')
      });
    }
  }
}
