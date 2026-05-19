import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PersonalFinanceService } from '../../../services/personal-finance.service';

@Component({
  selector: 'app-prediction-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid py-2">
      <div class="d-flex align-items-center mb-4">
        <a routerLink="/transactions" class="btn btn-outline-secondary btn-sm me-3"><i class="bi bi-arrow-left"></i></a>
        <h2 class="fw-bold m-0">Predicciones</h2>
      </div>
      <div class="card shadow-sm border-0">
        <div class="card-body p-5 text-center">
          <i class="bi bi-magic text-warning mb-3 d-block" style="font-size: 3rem;"></i>
          <h4>Proyectando tu futuro financiero...</h4>
          <p class="text-muted">Visualización de proyección de balance futuro. Pronto conectarás esto con el endpoint /prediction.</p>
        </div>
      </div>
    </div>
  `
})
export class PredictionViewComponent implements OnInit {
  private financeService = inject(PersonalFinanceService);

  ngOnInit() {
    this.financeService.getPrediction().subscribe(data => console.log('Predicción', data));
  }
}
