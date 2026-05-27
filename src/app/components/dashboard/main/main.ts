import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { PersonalFinanceService } from '../../../services/personal-finance.service';
import { AccountService } from '../../../services/account.service';
import { AuthStore } from '../../../store/auth.store';
import { PersonalFinance } from '../../../models/transaction.model';
import { Account } from '../../../models/account.model';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main implements OnInit {
  private readonly financeService = inject(PersonalFinanceService);
  private readonly accountService = inject(AccountService);
  private readonly authStore = inject(AuthStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly errorHandler = inject(ErrorHandlerService);

  readonly isLoading = signal(true);
  readonly recentTransactions = signal<PersonalFinance[]>([]);
  readonly accounts = signal<Account[]>([]);
  readonly totalBalance = signal(0);
  readonly userName = computed(() => this.authStore.user()?.name ?? 'Usuario');
  
  // Computed signals for stats cards
  readonly incomeMonth = computed(() => {
    const txns = this.recentTransactions();
    return txns
      .filter(t => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + (t.monto || 0), 0);
  });
  
  readonly expenseMonth = computed(() => {
    const txns = this.recentTransactions();
    return txns
      .filter(t => t.tipo === 'gasto')
      .reduce((sum, t) => sum + (t.monto || 0), 0);
  });
  
  readonly activeAccounts = computed(() => {
    return this.accounts().filter(a => a.isActive).length;
  });
  
  // Chart data
  readonly pieChartData = computed(() => {
    const txns = this.recentTransactions();
    const expensesByCategory: Record<string, number> = {};
    
    txns
      .filter(t => t.tipo === 'gasto')
      .forEach(t => {
        const category = t.categoria || 'Sin categoría';
        expensesByCategory[category] = (expensesByCategory[category] || 0) + (t.monto || 0);
      });
    
    return Object.values(expensesByCategory);
  });
  
  readonly pieChartType = 'pie' as const;
  
  readonly pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(amount || 0);
  }

  ngOnInit(): void {
    this.isLoading.set(true);
    
    // Load accounts first with finalize
    this.accountService.getAccounts()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (accounts) => {
          this.accounts.set(accounts ?? []);
          this.totalBalance.set((accounts ?? []).reduce((sum: number, a: Account) => sum + (a.balance || 0), 0));
          
          // Then load transactions with finalize
          this.financeService.getTransactions({ page: 1, limit: 5 })
            .pipe(
              takeUntilDestroyed(this.destroyRef),
              finalize(() => {
                this.isLoading.set(false);
              })
            )
            .subscribe({
              next: (transactions) => {
                this.recentTransactions.set((transactions?.data ?? []).slice(0, 5));
              },
              error: (err) => {
                this.errorHandler.handleHttpError(err, 'Dashboard - load transactions');
              },
            });
        },
        error: (err) => {
          this.errorHandler.handleHttpError(err, 'Dashboard - load accounts');
          this.isLoading.set(false);
        },
      });
  }
}
