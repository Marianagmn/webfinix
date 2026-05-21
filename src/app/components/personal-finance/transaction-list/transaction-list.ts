import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { PersonalFinanceService } from '../../../services/personal-finance.service';
import { PersonalFinance } from '../../../models/transaction.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.ts';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './transaction-list.html',
  styleUrls: ['./transaction-list.css'],
})
export class TransactionList implements OnInit {
  private readonly financeService = inject(PersonalFinanceService);
  private readonly toastr = inject(ToastrService);

  readonly transactions = signal<PersonalFinance[]>([]);
  readonly filteredTransactions = signal<PersonalFinance[]>([]);
  readonly isLoading = signal(false);
  searchTerm = '';

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.isLoading.set(true);
    this.financeService.getTransactions().subscribe({
      next: (data) => {
        this.transactions.set(data);
        this.filteredTransactions.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastr.error('No se pudieron cargar las transacciones.');
        this.filteredTransactions.set([]);
        this.isLoading.set(false);
      },
    });
  }

  filterTransactions() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredTransactions.set(this.transactions());
      return;
    }

    this.filteredTransactions.set(
      this.transactions().filter((transaction) => {
        return [
          transaction.description,
          transaction.type,
          transaction.accountId,
        ]
          .filter(Boolean)
          .some((value) => value!.toString().toLowerCase().includes(term));
      })
    );
  }

  deleteTransaction(id: string) {
    if (!confirm('¿Eliminar esta transacción?')) {
      return;
    }

    this.financeService.deleteTransaction(id).subscribe({
      next: () => {
        this.toastr.success('Transacción eliminada');
        this.loadTransactions();
      },
      error: () => {
        this.toastr.error('No se pudo eliminar la transacción.');
      },
    });
  }

  formatAmount(amount: number) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

