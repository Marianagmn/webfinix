import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatsCardComponent } from '../stats-card/stats-card.component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatsCardComponent, BaseChartDirective],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  totalBalance = '$0';
  incomeMonth = '$0';
  expenseMonth = '$0';
  activeAccounts = '0';
  recentTransactions: any[] = [];

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
    this.loadMockData();
  }

  loadMockData() {
    this.totalBalance = '$5,430.00';
    this.incomeMonth = '$3,200.00';
    this.expenseMonth = '$1,450.00';
    this.activeAccounts = '3';
    
    this.recentTransactions = [
      { id: '1', date: '2026-05-19', description: 'Compra Supermercado', amount: 150, type: 'expense' },
      { id: '2', date: '2026-05-18', description: 'Pago Nómina', amount: 3200, type: 'income' },
      { id: '3', date: '2026-05-15', description: 'Gasolina', amount: 45, type: 'expense' },
      { id: '4', date: '2026-05-14', description: 'Restaurante', amount: 80, type: 'expense' },
      { id: '5', date: '2026-05-10', description: 'Transferencia a Ahorros', amount: 200, type: 'transfer' }
    ];
  }
}
