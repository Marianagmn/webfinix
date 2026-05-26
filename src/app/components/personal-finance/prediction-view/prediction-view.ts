import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PersonalFinanceService } from '../../../services/personal-finance.service';
import { PredictionResponse } from '../../../models/personal-finance.model';

@Component({
  selector: 'app-prediction-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prediction-view.html',
  styleUrl: './prediction-view.css',
})
export class PredictionView implements OnInit {
  private readonly service = inject(PersonalFinanceService);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);
  readonly hasError = signal(false);
  readonly predictionData = signal<PredictionResponse | null>(null);

  ngOnInit(): void {
    this.loadPrediction();
  }

  loadPrediction(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.service.getPrediction()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.predictionData.set(res.data);
          this.isLoading.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.isLoading.set(false);
          this.toastr.error('Error al cargar predicciones');
        },
      });
  }

  getConfidenceClass(): string {
    // PredictionResponse no tiene confianza directa
    // Usamos la tendencia como indicador
    const tendencia = this.predictionData()?.resumen?.tendencia;
    if (tendencia === 'creciente') return 'text-success';
    if (tendencia === 'estable') return 'text-warning';
    return 'text-danger';
  }
}
