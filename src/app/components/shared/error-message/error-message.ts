import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-message.html',
  styleUrls: ['./error-message.css'],
})
export class ErrorMessageComponent {
  readonly title = input<string>('Ocurrió un error');
  readonly message = input<string>('Intenta de nuevo más tarde.');
  readonly retry = output<void>();
}

