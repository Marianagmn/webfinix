// src/app/shared/ui/shared-ui.module.ts
// PHASE 3 FIX: Shared UI module with reusable components (standalone)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { CardComponent } from './components/card/card.component';
import { LoaderComponent } from './components/loader/loader.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { ModalComponent } from './components/modal/modal.component';
import { BadgeComponent } from './components/badge/badge.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    LoaderComponent,
    EmptyStateComponent,
    ModalComponent,
    BadgeComponent,
  ],
  exports: [
    ButtonComponent,
    CardComponent,
    LoaderComponent,
    EmptyStateComponent,
    ModalComponent,
    BadgeComponent,
  ],
})
export class SharedUiModule {}
