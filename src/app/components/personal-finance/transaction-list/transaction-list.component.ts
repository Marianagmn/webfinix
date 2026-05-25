import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PersonalFinanceService } from '../../../services/personal-finance.service';
import { PersonalFinance } from '../../../models/personal-finance.model';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './transaction-list.component.html'
})
export class TransactionListComponent implements OnInit {
  private financeService = inject(PersonalFinanceService);
  private toastr = inject(ToastrService);

  transactions: PersonalFinance[] = [];
  filteredTransactions: PersonalFinance[] = [];
  isLoading = true;

  searchTerm = '';

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.isLoading = true;
    this.financeService.getTransactions().subscribe({
      next: (response) => {
        this.transactions = response.data;
        this.filteredTransactions = response.data;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Error al cargar transacciones');
        this.isLoading = false;
      }
    });
  }

  filterTransactions() {
    if (!this.searchTerm) {
      this.filteredTransactions = this.transactions;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredTransactions = this.transactions.filter((t) =>
      [t.descripcion, t.tipo]
        .filter(Boolean)
        .some((value) => value!.toString().toLowerCase().includes(term))
    );
  }

  deleteTransaction(id: string) {
    if (confirm('¿Estás seguro de eliminar esta transacción?')) {
      this.financeService.deleteTransaction(id).subscribe({
        next: () => {
          this.toastr.success('Transacción eliminada');
          this.loadTransactions();
        },
        error: () => this.toastr.error('Error al eliminar')
      });
    }
  }
}
