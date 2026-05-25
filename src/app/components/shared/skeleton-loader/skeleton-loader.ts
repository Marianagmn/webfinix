import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'skeleton ' + (type() || 'text')" [style.width]="width()" [style.height]="height()">
      <div class="shimmer"></div>
    </div>
  `,
  styles: [`
    .skeleton {
      position: relative;
      background-color: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
    }

    .skeleton.text {
      height: 16px;
      margin-bottom: 8px;
    }

    .skeleton.title {
      height: 24px;
      margin-bottom: 12px;
    }

    .skeleton.avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .skeleton.card {
      height: 120px;
      border-radius: 8px;
    }

    .skeleton.table-row {
      height: 48px;
      border-radius: 4px;
    }

    .shimmer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
      );
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `]
})
export class SkeletonLoader {
  type = input<'text' | 'title' | 'avatar' | 'card' | 'table-row'>('text');
  width = input<string>('100%');
  height = input<string>('');
}
