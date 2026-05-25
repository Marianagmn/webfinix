import { Routes } from '@angular/router';
import { publicGuard } from '../../core/guards/public.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    canActivate: [publicGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('../../components/auth/login/login').then(m => m.Login),
        canActivate: [publicGuard],
      },
      {
        path: 'register',
        loadComponent: () => import('../../components/auth/register/register').then(m => m.Register),
        canActivate: [publicGuard],
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];
