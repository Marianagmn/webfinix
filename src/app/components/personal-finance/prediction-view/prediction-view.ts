import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PersonalFinanceService } from '../../../services/personal-finance.service';
import { PredictionData } from '../../../models/analytics.model';

@Component({
  selector: 'app-prediction-view',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './prediction-view.html',
  styleUrl: './prediction-view.css',
})
export class PredictionView implements OnInit {
  private readonly service = inject(PersonalFinanceService);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);
  readonly hasError = signal(false);
  readonly predictionData = signal<PredictionData | null>(null);

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
    const confianza = this.predictionData()?.confianza ?? 0;
    if (confianza >= 80) return 'text-success';
    if (confianza >= 50) return 'text-warning';
    return 'text-danger';
  }
}
