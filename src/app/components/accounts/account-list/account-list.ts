import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/account.model';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './account-list.html',
  styleUrl: './account-list.css',
})
export class AccountList implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly accounts = signal<Account[]>([]);
  readonly isLoading = signal(false);
  readonly confirmDeleteId = signal<string | null>(null);

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.isLoading.set(true);
    this.accountService
      .getAccounts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (accounts: Account[]) => {
          this.accounts.set(accounts ?? []);
          this.isLoading.set(false);
        },
        error: () => {
          this.toastr.error('No se pudieron cargar las cuentas.');
          this.isLoading.set(false);
        },
      });
  }

  requestDelete(id: string) { this.confirmDeleteId.set(id); }
  cancelDelete() { this.confirmDeleteId.set(null); }

  confirmDelete() {
    const id = this.confirmDeleteId();
    if (!id) return;
    this.confirmDeleteId.set(null);
    this.accountService
      .deleteAccount(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.toastr.success('Cuenta eliminada'); this.loadAccounts(); },
        error: () => this.toastr.error('No se pudo eliminar la cuenta.'),
      });
  }

  formatBalance(balance: number, moneda: string) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: moneda,
      maximumFractionDigits: 0,
    }).format(balance);
  }

  tipoIcon(tipo: string): string {
    const map: Record<string, string> = {
      efectivo: '💵', ahorro: '🏦', corriente: '🏧', credito: '💳', inversion: '📈',
    };
    return map[tipo] ?? '💰';
  }
}
