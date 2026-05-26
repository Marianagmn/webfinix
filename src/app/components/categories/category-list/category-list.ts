import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { PaginatedResponse } from '../../../models/api-response.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories = signal<Category[]>([]);
  readonly isLoading = signal(false);
  readonly confirmDeleteId = signal<string | null>(null);

  // Pagination state
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly totalItems = signal(0);
  readonly pageSize = signal(20);

  ngOnInit() { this.loadCategories(); }

  loadCategories() {
    this.isLoading.set(true);
    this.categoryService.getCategories(undefined, this.currentPage(), this.pageSize())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: PaginatedResponse<Category>) => {
          const data = res.data ?? [];
          this.categories.set(data);
          
          // Update pagination from meta
          if (res.meta?.pagination) {
            this.currentPage.set(res.meta.pagination.page);
            this.totalPages.set(res.meta.pagination.totalPages);
            this.totalItems.set(res.meta.pagination.total);
          }
          
          this.isLoading.set(false);
        },
        error: () => { this.toastr.error('No se pudieron cargar las categorías.'); this.isLoading.set(false); },
      });
  }

  requestDelete(id: string) { this.confirmDeleteId.set(id); }
  cancelDelete() { this.confirmDeleteId.set(null); }

  confirmDelete() {
    const id = this.confirmDeleteId();
    if (!id) return;
    this.confirmDeleteId.set(null);
    this.categoryService.deleteCategory(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.toastr.success('Categoría eliminada'); this.loadCategories(); },
        error: () => this.toastr.error('No se pudo eliminar la categoría.'),
      });
  }

  tipoColor(tipo: string): string {
    return tipo === 'ingreso' ? 'success' : tipo === 'gasto' ? 'danger' : 'info';
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadCategories();
  }

  onNextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.onPageChange(this.currentPage() + 1);
    }
  }

  onPrevPage() {
    if (this.currentPage() > 1) {
      this.onPageChange(this.currentPage() - 1);
    }
  }
}
