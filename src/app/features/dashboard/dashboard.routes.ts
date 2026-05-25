import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('../../components/dashboard/main/main').then(m => m.Main),
      },
    ],
  },
];
