import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatsCardComponent } from '../stats-card/stats-card.component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AccountService } from '../../../services/account.service';
import { PersonalFinanceService } from '../../../services/personal-finance.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatsCardComponent, BaseChartDirective],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  totalBalance = 0;
  incomeMonth = 0;
  expenseMonth = 0;
  activeAccounts = 0;
  recentTransactions: any[] = [];
  isLoading = true;

  private accountService = inject(AccountService);
  private financeService = inject(PersonalFinanceService);

  // Configuración de Chart.js
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' },
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Alimentación', 'Transporte', 'Vivienda', 'Ocio'],
    datasets: [{
      data: [300, 150, 800, 200],
      backgroundColor: ['#ef4444', '#f59e0b', '#4f46e5', '#10b981']
    }]
  };
  public pieChartType: ChartType = 'pie';

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    forkJoin({
      accounts: this.accountService.getAccounts(),
      transactions: this.financeService.getTransactions()
    }).subscribe({
      next: ({ accounts, transactions }) => {
        if (!accounts || !transactions?.data) {
          console.error('Invalid data received from API');
          this.isLoading = false;
          return;
        }

        this.activeAccounts = accounts.filter((a: any) => a.isActive).length;
        this.totalBalance = accounts.reduce((sum: number, a: any) => sum + a.balance, 0);

        // Procesar transacciones recientes
        this.recentTransactions = transactions.data.slice(0, 5);

        // Calcular ingresos y gastos del mes actual
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        this.incomeMonth = transactions.data
          .filter((t: any) => {
            const date = new Date(t.fecha);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear && t.tipo === 'ingreso';
          })
          .reduce((sum: number, t: any) => sum + t.monto, 0);
        this.expenseMonth = transactions.data
          .filter((t: any) => {
            const date = new Date(t.fecha);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear && t.tipo === 'gasto';
          })
          .reduce((sum: number, t: any) => sum + t.monto, 0);

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.isLoading = false;
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(value);
  }
}
