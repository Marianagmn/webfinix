import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const BUSINESS_FINANCE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('../../components/business-finance/business-list/business-list.ts').then(m => m.BusinessList) },
      { path: 'approvals', canActivate: [roleGuard('aprobador')], loadComponent: () => import('../../components/business-finance/approval-list/approval-list.ts').then(m => m.ApprovalList) },
    ],
  },
];
