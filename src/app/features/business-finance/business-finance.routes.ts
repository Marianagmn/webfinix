import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const BUSINESS_FINANCE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('../../components/business-finance/business-list/business-list.ts').then(m => m.BusinessList) },
      { path: 'create', loadComponent: () => import('../../components/business-finance/business-create/business-create.ts').then(m => m.BusinessCreate) },
      { path: ':id/edit', loadComponent: () => import('../../components/business-finance/business-edit/business-edit.ts').then(m => m.BusinessEdit) },
      { path: 'approvals', canActivate: [roleGuard('aprobador', 'admin', 'superadmin')], loadComponent: () => import('../../components/business-finance/approval-list/approval-list.ts').then(m => m.ApprovalList) },
      { path: 'approvals/:id', canActivate: [roleGuard('aprobador', 'admin', 'superadmin')], loadComponent: () => import('../../components/business-finance/approval-detail/approval-detail.ts').then(m => m.ApprovalDetail) },
      { path: ':id/payments', loadComponent: () => import('../../components/business-finance/payment-form/payment-form.ts').then(m => m.PaymentForm) },
    ],
  },
];
