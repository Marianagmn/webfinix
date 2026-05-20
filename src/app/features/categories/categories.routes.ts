import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('../../components/categories/category-list/category-list.ts').then(m => m.CategoryList) },
      { path: 'create', loadComponent: () => import('../../components/categories/category-create/category-create.ts').then(m => m.CategoryCreate) },
      { path: ':id/edit', loadComponent: () => import('../../components/categories/category-edit/category-edit.ts').then(m => m.CategoryEdit) },
    ],
  },
];
