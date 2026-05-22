import { Component, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoryService } from '../../../services/category.service';
import { CategoryTipo } from '../../../models/category.model';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './category-create.html',
  styleUrl: './category-create.css',
})
export class CategoryCreate {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly tipos: CategoryTipo[] = ['ingreso', 'gasto', 'transferencia'];

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    tipo: ['gasto' as CategoryTipo, Validators.required],
    color: ['#6c757d'],
    icono: [''],
  });

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const raw = this.form.value;
    this.categoryService.createCategory({
      nombre: raw.nombre!,
      tipo: raw.tipo!,
      color: raw.color || undefined,
      icono: raw.icono || undefined,
    }).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.loading.set(false); this.toastr.success('Categoría creada'); this.router.navigate(['/categories']); },
        error: () => this.loading.set(false),
      });
  }
}
