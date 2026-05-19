import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Category, CategoryType } from '../../../models/category.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.component.html'
})
export class CategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private toastr = inject(ToastrService);

  categories: Category[] = [];
  filteredCategories: Category[] = [];
  isLoading = true;
  currentFilter: CategoryType | 'all' = 'all';

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.applyFilter(this.currentFilter);
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Error al cargar las categorías');
        this.isLoading = false;
      }
    });
  }

  applyFilter(type: CategoryType | 'all') {
    this.currentFilter = type;
    if (type === 'all') {
      this.filteredCategories = this.categories;
    } else {
      this.filteredCategories = this.categories.filter(c => c.tipo === type);
    }
  }

  deleteCategory(id: string) {
    if(confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.toastr.success('Categoría eliminada');
          this.loadCategories();
        },
        error: () => this.toastr.error('Error al eliminar categoría')
      });
    }
  }
}
