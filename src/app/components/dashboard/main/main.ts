import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { PersonalFinanceService } from '../../../services/personal-finance.service';
import { AccountService } from '../../../services/account.service';
import { AuthStore } from '../../../store/auth.store';
import { PersonalFinance } from '../../../models/transaction.model';
import { Account } from '../../../models/account.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main implements OnInit {
  private readonly financeService = inject(PersonalFinanceService);
  private readonly accountService = inject(AccountService);
  private readonly authStore = inject(AuthStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);

  readonly isLoading = signal(true);
  readonly recentTransactions = signal<PersonalFinance[]>([]);
  readonly accounts = signal<Account[]>([]);
  readonly totalBalance = signal(0);
  readonly userName = computed(() => this.authStore.user()?.name ?? 'Usuario');

  ngOnInit(): void {
    this.isLoading.set(true);
    console.log('Loading dashboard data...');
    forkJoin({
      transactions: this.financeService.getTransactions({ page: 1, limit: 5 }),
      accounts: this.accountService.getAccounts(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ transactions, accounts }) => {
          console.log('Dashboard data loaded:', { transactions, accounts });
          this.recentTransactions.set((transactions.data || []).slice(0, 5));
          this.accounts.set(accounts || []);
          this.totalBalance.set((accounts || []).reduce((sum: number, a: Account) => sum + (a.balance || 0), 0));
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Dashboard load error:', err);
          this.toastr.error('Error al cargar el dashboard');
          this.isLoading.set(false);
        },
      });
  }
}
