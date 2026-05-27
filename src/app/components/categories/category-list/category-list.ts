import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories = signal<Category[]>([]);
  readonly isLoading = signal(false);
  readonly confirmDeleteId = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly totalItems = signal(0);

  ngOnInit() { this.loadCategories(); }

  loadCategories() {
    this.isLoading.set(true);
    this.categoryService.getCategories(undefined, this.currentPage(), 20)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (categories: Category[]) => {
          this.categories.set(categories ?? []);
          this.totalItems.set(categories.length);
          this.totalPages.set(Math.ceil(categories.length / 20));
        },
        error: (err) => {
          this.errorHandler.handleHttpError(err, 'CategoryList - load categories');
        },
      });
  }

  requestDelete(id: string) { this.confirmDeleteId.set(id); }
  cancelDelete() { this.confirmDeleteId.set(null); }

  confirmDelete() {
    const id = this.confirmDeleteId();
    if (!id) return;
    this.confirmDeleteId.set(null);
    this.categoryService.deleteCategory(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {})
      )
      .subscribe({
        next: () => {
          this.errorHandler.handleSuccess('Categoría eliminada');
          this.loadCategories();
        },
        error: (err) => {
          this.errorHandler.handleHttpError(err, 'CategoryList - delete category');
        },
      });
  }

  tipoColor(tipo: string): string {
    return tipo === 'ingreso' ? 'success' : tipo === 'gasto' ? 'danger' : 'info';
  }

  onPrevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadCategories();
    }
  }

  onNextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadCategories();
    }
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadCategories();
  }
}
