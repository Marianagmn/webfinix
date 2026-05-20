import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const USER_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'profile', loadComponent: () => import('../../components/user/profile/profile.ts').then(m => m.Profile) },
      { path: 'change-password', loadComponent: () => import('../../components/user/change-password/change-password.ts').then(m => m.ChangePassword) },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
    ],
  },
];
