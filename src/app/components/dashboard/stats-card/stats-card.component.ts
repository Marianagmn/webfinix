import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card shadow-sm h-100 border-0">
      <div class="card-body d-flex align-items-center">
        <div class="rounded-circle p-3 d-flex align-items-center justify-content-center bg-{{color}} bg-opacity-10 text-{{color}}" style="width: 60px; height: 60px;">
          <i class="bi bi-{{icon}} fs-3"></i>
        </div>
        <div class="ms-3">
          <h6 class="text-muted mb-1">{{ title }}</h6>
          <h3 class="mb-0 fw-bold">{{ value }}</h3>
        </div>
      </div>
    </div>
  `
})
export class StatsCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() icon: string = 'info-circle';
  @Input() color: string = 'primary';
}
