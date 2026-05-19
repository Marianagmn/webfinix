import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/account.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './account-list.component.html'
})
export class AccountListComponent implements OnInit {
  private accountService = inject(AccountService);
  private toastr = inject(ToastrService);

  accounts: Account[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.isLoading = true;
    this.accountService.getAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Error al cargar las cuentas', 'Error');
        this.isLoading = false;
      }
    });
  }

  deleteAccount(id: string) {
    if(confirm('¿Estás seguro de eliminar esta cuenta?')) {
      this.accountService.deleteAccount(id).subscribe({
        next: () => {
          this.toastr.success('Cuenta eliminada');
          this.loadAccounts();
        },
        error: () => this.toastr.error('Error al eliminar cuenta')
      });
    }
  }
}
