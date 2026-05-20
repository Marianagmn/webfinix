import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PersonalFinanceService } from '../../../services/personal-finance.service';

@Component({
  selector: 'app-analysis-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid py-2">
      <div class="d-flex align-items-center mb-4">
        <a routerLink="/transactions" class="btn btn-outline-secondary btn-sm me-3"><i class="bi bi-arrow-left"></i></a>
        <h2 class="fw-bold m-0">Análisis Financiero con IA</h2>
      </div>
      <div class="card shadow-sm border-0">
        <div class="card-body p-5 text-center">
          <i class="bi bi-robot text-primary mb-3 d-block" style="font-size: 3rem;"></i>
          <h4>Generando insights...</h4>
          <p class="text-muted">Aquí se mostrará el análisis de tus patrones de gastos, tendencias y recomendaciones para ahorrar, basados en el endpoint /analysis.</p>
        </div>
      </div>
    </div>
  `
})
export class AnalysisViewComponent implements OnInit {
  private financeService = inject(PersonalFinanceService);

  ngOnInit() {
    this.financeService.getAnalysis().subscribe(data => console.log('Análisis', data));
  }
}
