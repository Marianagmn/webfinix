import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PersonalFinanceService } from '../../../services/personal-finance.service';

@Component({
  selector: 'app-simulation-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid py-2">
      <div class="d-flex align-items-center mb-4">
        <a routerLink="/transactions" class="btn btn-outline-secondary btn-sm me-3"><i class="bi bi-arrow-left"></i></a>
        <h2 class="fw-bold m-0">Simulador de Escenarios</h2>
      </div>
      <div class="card shadow-sm border-0">
        <div class="card-body p-5 text-center">
          <i class="bi bi-sliders text-success mb-3 d-block" style="font-size: 3rem;"></i>
          <h4>¿Qué pasaría si...?</h4>
          <p class="text-muted">Simulador de escenarios. Por ejemplo, ¿qué pasaría si ahorro 10% extra? Integrado con /simulation.</p>
        </div>
      </div>
    </div>
  `
})
export class SimulationViewComponent implements OnInit {
  private financeService = inject(PersonalFinanceService);

  ngOnInit() {
    this.financeService.getSimulation().subscribe(data => console.log('Simulación', data));
  }
}
