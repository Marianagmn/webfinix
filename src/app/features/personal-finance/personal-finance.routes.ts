import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const PERSONAL_FINANCE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('../../components/personal-finance/transaction-list/transaction-list.ts').then(m => m.TransactionList) },
      { path: 'create', loadComponent: () => import('../../components/personal-finance/transaction-create/transaction-create.ts').then(m => m.TransactionCreate) },
      { path: 'analysis', loadComponent: () => import('../../components/personal-finance/analysis-view/analysis-view.ts').then(m => m.AnalysisView) },
      { path: 'prediction', loadComponent: () => import('../../components/personal-finance/prediction-view/prediction-view.ts').then(m => m.PredictionView) },
      { path: 'simulation', loadComponent: () => import('../../components/personal-finance/simulation-view/simulation-view.ts').then(m => m.SimulationView) },
    ],
  },
];
