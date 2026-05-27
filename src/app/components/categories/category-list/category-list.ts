import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

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
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly totalItems = signal(0);

  ngOnInit() { this.loadCategories(); }

  loadCategories() {
    this.isLoading.set(true);
    console.log('Loading categories page:', this.currentPage());
    this.categoryService.getCategories(undefined, this.currentPage(), 20)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          console.log('Categories request finalized');
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (categories: Category[]) => {
          console.log('Categories API response:', categories);
          console.log('Categories count:', categories?.length || 0);
          this.categories.set(categories ?? []);
          this.totalItems.set(categories.length);
          this.totalPages.set(Math.ceil(categories.length / 20));
        },
        error: (err) => {
          console.error('Categories load error:', err);
          this.toastr.error('No se pudieron cargar las categorías.');
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
        finalize(() => console.log('Delete category request finalized'))
      )
      .subscribe({
        next: () => {
          console.log('Category deleted successfully:', id);
          this.toastr.success('Categoría eliminada');
          this.loadCategories();
        },
        error: (err) => {
          console.error('Delete category error:', err);
          this.toastr.error('No se pudo eliminar la categoría.');
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
