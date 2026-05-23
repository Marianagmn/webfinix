// src/app/core/loading/global-loading.component.ts
// PHASE 3 FIX: Global loading component
import { Component } from '@angular/core';
import { GlobalLoadingService } from './global-loading.service';

@Component({
  selector: 'app-global-loading',
  standalone: true,
  template: `
    @if (globalLoading.isLoading()) {
      <div class="global-loading-overlay">
        <div class="global-loading-spinner"></div>
      </div>
    }
  `,
  styles: `
    .global-loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    .global-loading-spinner {
      width: 3rem;
      height: 3rem;
      border: 4px solid #e5e7eb;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class GlobalLoadingComponent {
  constructor(public globalLoading: GlobalLoadingService) {}
}
