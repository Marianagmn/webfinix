import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const USER_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'profile', loadComponent: () => import('../../components/user/profile/profile').then(m => m.Profile) },
      { path: 'change-password', loadComponent: () => import('../../components/user/change-password/change-password').then(m => m.ChangePassword) },
      { path: 'business/create', loadComponent: () => import('../../components/business/business-create/business-create').then(m => m.BusinessCreate) },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
    ],
  },
];
