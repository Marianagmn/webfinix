// src/app/shared/ui/components/badge/badge.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent {
  @Input() variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' = 'primary';
  @Input() size: 'sm' | 'md' = 'md';
  @Input() rounded = false;

  getClasses(): string {
    const classes: string[] = [this.variant, this.size];
    if (this.rounded) classes.push('rounded');
    return classes.join(' ');
  }
}
