import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const BUSINESS_FINANCE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('../../components/business-finance/business-list/business-list').then(m => m.BusinessList) },
      { path: 'create', loadComponent: () => import('../../components/business-finance/business-create/business-create').then(m => m.BusinessCreate) },
      { path: ':id/edit', loadComponent: () => import('../../components/business-finance/business-edit/business-edit').then(m => m.BusinessEdit) },
      { path: 'approvals', canActivate: [roleGuard('aprobador', 'admin', 'superadmin')], loadComponent: () => import('../../components/business-finance/approval-list/approval-list').then(m => m.ApprovalList) },
      { path: 'approvals/:id', canActivate: [roleGuard('aprobador', 'admin', 'superadmin')], loadComponent: () => import('../../components/business-finance/approval-detail/approval-detail').then(m => m.ApprovalDetail) },
      { path: ':id/payments', loadComponent: () => import('../../components/business-finance/payment-form/payment-form').then(m => m.PaymentForm) },
    ],
  },
];
