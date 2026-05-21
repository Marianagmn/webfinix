import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.html',
  styleUrls: ['./loading-spinner.css'],
})
export class LoadingSpinnerComponent {
  readonly size = input<number>(2);
  readonly fullscreen = input<boolean>(false);
  readonly loading = signal(true);
}

