import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const ACCOUNTS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('../../components/accounts/account-list/account-list').then(m => m.AccountList) },
      { path: 'create', loadComponent: () => import('../../components/accounts/account-create/account-create').then(m => m.AccountCreate) },
      { path: ':id/edit', loadComponent: () => import('../../components/accounts/account-edit/account-edit').then(m => m.AccountEdit) },
    ],
  },
];
