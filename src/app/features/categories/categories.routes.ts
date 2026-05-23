import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('../../components/categories/category-list/category-list').then(m => m.CategoryList) },
      { path: 'create', loadComponent: () => import('../../components/categories/category-create/category-create').then(m => m.CategoryCreate) },
      { path: ':id/edit', loadComponent: () => import('../../components/categories/category-edit/category-edit').then(m => m.CategoryEdit) },
    ],
  },
];
