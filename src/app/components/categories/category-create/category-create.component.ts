import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './category-create.component.html'
})
export class CategoryCreateComponent {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  categoryForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    tipo: ['expense', Validators.required],
    color: ['#4f46e5', Validators.required],
    icono: ['tag', Validators.required]
  });

  isLoading = false;
  
  availableIcons = ['tag', 'cart', 'house', 'car-front', 'lightning', 'bag', 'heart', 'cup-hot', 'bus-front', 'airplane', 'bank', 'cash-coin', 'cart-check', 'controller', 'film'];

  onSubmit() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.categoryService.createCategory(this.categoryForm.value).subscribe({
      next: () => {
        this.toastr.success('Categoría creada exitosamente');
        this.router.navigate(['/categories']);
      },
      error: () => {
        this.toastr.error('Error al crear la categoría');
        this.isLoading = false;
      }
    });
  }
}
