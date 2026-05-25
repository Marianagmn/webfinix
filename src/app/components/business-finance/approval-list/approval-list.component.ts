import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BusinessFinanceService } from '../../../services/business-finance.service';
import { BusinessFinance } from '../../../models/business-finance.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-approval-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './approval-list.component.html'
})
export class ApprovalListComponent implements OnInit {
  private businessService = inject(BusinessFinanceService);
  private toastr = inject(ToastrService);

  approvals: BusinessFinance[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadApprovals();
  }

  loadApprovals() {
    this.isLoading = true;
    this.businessService.getPendingApprovals().subscribe({
      next: (response) => {
        this.approvals = response.data;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Error al cargar aprobaciones pendientes');
        this.isLoading = false;
      }
    });
  }

  approve(id: string) {
    this.businessService.approve(id).subscribe({
      next: () => {
        this.toastr.success('Transacción Aprobada');
        this.loadApprovals();
      },
      error: () => this.toastr.error('Error al aprobar')
    });
  }

  reject(id: string) {
    if(confirm('¿Seguro que deseas rechazar esta transacción?')) {
      this.businessService.reject(id).subscribe({
        next: () => {
          this.toastr.warning('Transacción Rechazada');
          this.loadApprovals();
        },
        error: () => this.toastr.error('Error al rechazar')
      });
    }
  }
}
