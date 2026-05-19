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

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'accounts', component: AccountListComponent },
      { path: 'accounts/create', component: AccountCreateComponent },
      { path: 'accounts/:id/edit', component: AccountEditComponent },
      { path: 'categories', component: CategoryListComponent },
      { path: 'categories/create', component: CategoryCreateComponent },
      // Aquí agregaremos más rutas autenticadas en futuras fases
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
