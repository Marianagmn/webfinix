import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PersonalFinanceService } from '../../../services/personal-finance.service';
import { AnalysisData } from '../../../models/analytics.model';

@Component({
  selector: 'app-analysis-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analysis-view.html',
  styleUrl: './analysis-view.css',
})
export class AnalysisView implements OnInit {
  private readonly service = inject(PersonalFinanceService);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);
  readonly hasError = signal(false);
  readonly analysisData = signal<AnalysisData | null>(null);

  ngOnInit(): void {
    this.loadAnalysis();
  }

  loadAnalysis(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.service.getAnalysis()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.analysisData.set(res.data);
          this.isLoading.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.isLoading.set(false);
          this.toastr.error('Error al cargar análisis');
        },
      });
  }

  getTendenciaClass(): string {
    const tendencia = this.analysisData()?.tendencia;
    switch (tendencia) {
      case 'positiva': return 'text-success';
      case 'negativa': return 'text-danger';
      default: return 'text-muted';
    }
  }

  getTendenciaIcon(): string {
    const tendencia = this.analysisData()?.tendencia;
    switch (tendencia) {
      case 'positiva': return 'bi-arrow-up-circle-fill';
      case 'negativa': return 'bi-arrow-down-circle-fill';
      default: return 'bi-dash-circle-fill';
    }
  }
}
