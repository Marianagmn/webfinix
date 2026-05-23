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
      },
      {
        path: 'register',
        loadComponent: () => import('../../components/auth/register/register').then(m => m.Register),
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('../../components/auth/forgot-password/forgot-password').then(m => m.ForgotPassword),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];
