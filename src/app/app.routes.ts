import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES) },
      { path: 'personal-finance', loadChildren: () => import('./features/personal-finance/personal-finance.routes').then(m => m.PERSONAL_FINANCE_ROUTES) },
      { path: 'business-finance', loadChildren: () => import('./features/business-finance/business-finance.routes').then(m => m.BUSINESS_FINANCE_ROUTES) },
      { path: 'accounts', loadChildren: () => import('./features/accounts/accounts.routes').then(m => m.ACCOUNTS_ROUTES) },
      { path: 'categories', loadChildren: () => import('./features/categories/categories.routes').then(m => m.CATEGORIES_ROUTES) },
      { path: 'user', loadChildren: () => import('./features/user/user.routes').then(m => m.USER_ROUTES) },
    ],
  },
  { path: '**', redirectTo: 'auth' },
];
