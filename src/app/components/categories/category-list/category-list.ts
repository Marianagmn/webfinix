import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

  ngOnInit() { this.loadCategories(); }

  loadCategories() {
    this.isLoading.set(true);
    this.categoryService.getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (r) => { this.categories.set(r.data); this.isLoading.set(false); },
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
}
