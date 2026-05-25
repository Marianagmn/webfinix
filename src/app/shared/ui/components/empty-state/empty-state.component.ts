// src/app/shared/ui/components/empty-state/empty-state.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
})
export class EmptyStateComponent {
  @Input() icon?: string;
  @Input() title = 'No data found';
  @Input() description?: string;
  @Input() actionText?: string;
  @Input() showAction = false;
}
