import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PersonalFinanceService } from '../../../services/personal-finance.service';
import { SimulationData } from '../../../models/analytics.model';

@Component({
  selector: 'app-simulation-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './simulation-view.html',
  styleUrl: './simulation-view.css',
})
export class SimulationView implements OnInit {
  private readonly service = inject(PersonalFinanceService);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);
  readonly hasError = signal(false);
  readonly simulationData = signal<SimulationData | null>(null);

  ngOnInit(): void {
    this.loadSimulation();
  }

  loadSimulation(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.service.getSimulation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.simulationData.set(res.data);
          this.isLoading.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.isLoading.set(false);
          this.toastr.error('Error al cargar simulaciones');
        },
      });
  }
}
