import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/main/dashboard.component';
import { AccountListComponent } from './components/accounts/account-list/account-list.component';
import { AccountCreateComponent } from './components/accounts/account-create/account-create.component';
import { AccountEditComponent } from './components/accounts/account-edit/account-edit.component';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { CategoryCreateComponent } from './components/categories/category-create/category-create.component';
import { TransactionListComponent } from './components/personal-finance/transaction-list/transaction-list.component';
import { TransactionCreateComponent } from './components/personal-finance/transaction-create/transaction-create.component';
import { TransactionEdit } from './components/personal-finance/transaction-edit/transaction-edit';
import { AnalysisViewComponent } from './components/personal-finance/analysis-view/analysis-view.component';
import { PredictionViewComponent } from './components/personal-finance/prediction-view/prediction-view.component';
import { SimulationViewComponent } from './components/personal-finance/simulation-view/simulation-view.component';
import { BusinessListComponent } from './components/business-finance/business-list/business-list.component';
import { ApprovalListComponent } from './components/business-finance/approval-list/approval-list.component';
import { Profile } from './components/user/profile/profile';
import { ChangePassword } from './components/user/change-password/change-password';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: Profile },
      { path: 'change-password', component: ChangePassword },
      { path: 'accounts', component: AccountListComponent },
      { path: 'accounts/create', component: AccountCreateComponent },
      { path: 'accounts/:id/edit', component: AccountEditComponent },
      { path: 'categories', component: CategoryListComponent },
      { path: 'categories/create', component: CategoryCreateComponent },
      { path: 'transactions', component: TransactionListComponent },
      { path: 'transactions/create', component: TransactionCreateComponent },
      { path: 'transactions/:id/edit', component: TransactionEdit },
      { path: 'transactions/analysis', component: AnalysisViewComponent },
      { path: 'transactions/prediction', component: PredictionViewComponent },
      { path: 'transactions/simulation', component: SimulationViewComponent },
      { path: 'business', component: BusinessListComponent },
      { path: 'business/approvals', component: ApprovalListComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
