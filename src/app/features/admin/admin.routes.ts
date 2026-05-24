import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard('admin', 'superadmin')],
    children: [
      { path: 'users', loadComponent: () => import('../../components/admin/user-list/user-list').then(m => m.UserList) },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
    ],
  },
];
