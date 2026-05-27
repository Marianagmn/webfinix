import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PersonalFinanceService } from '../../../services/personal-finance.service';
import { AnalysisResponse } from '../../../models/personal-finance.model';

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
  readonly analysisData = signal<AnalysisResponse | null>(null);

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
          this.analysisData.set(res);
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
    // AnalysisResponse no tiene tendencia directa, pero tiene tendencias[]
    // Derivamos la tendencia del balance neto
    const data = this.analysisData();
    if (!data) return 'text-muted';
    
    const balance = data.balance;
    if (balance > 0) return 'text-success';
    if (balance < 0) return 'text-danger';
    return 'text-muted';
  }

  getTendenciaIcon(): string {
    const data = this.analysisData();
    if (!data) return 'bi-dash-circle';
    
    const balance = data.balance;
    if (balance > 0) return 'bi-arrow-up-circle-fill';
    if (balance < 0) return 'bi-arrow-down-circle-fill';
    return 'bi-dash-circle';
  }
}
