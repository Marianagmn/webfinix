// src/app/app.ts — D-05: llama authStore.init() al arrancar para restaurar usuario tras F5
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from './store/auth.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly authStore = inject(AuthStore);

  title = 'Finix';

  ngOnInit(): void {
    // M-02/D-05: restaurar usuario desde /auth/me al cargar la app
    this.authStore.init();
  }
}
