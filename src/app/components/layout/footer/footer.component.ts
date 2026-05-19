import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-light text-center text-muted py-3 border-top mt-auto">
      <small>&copy; 2026 WebFinix. Todos los derechos reservados.</small>
    </footer>
  `
})
export class FooterComponent { }
