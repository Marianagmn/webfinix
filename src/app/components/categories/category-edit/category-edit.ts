import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoryService } from '../../../services/category.service';
import { CategoryTipo } from '../../../models/category.model';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-edit.html',
  styleUrls: ['./category-edit.css'],
})
export class CategoryEdit implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly loadingData = signal(true);
  readonly tipos: CategoryTipo[] = ['ingreso', 'gasto', 'transferencia'];
  private categoryId!: string;

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    tipo: ['gasto' as CategoryTipo, Validators.required],
    color: ['#6c757d'],
    icono: [''],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastr.error('ID de categoría inválido.');
      this.router.navigate(['/categories']);
      return;
    }

    this.categoryId = id;
    this.categoryService.getCategoryById(this.categoryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const c = response.data;
          this.form.patchValue({ nombre: c.nombre, tipo: c.tipo, color: c.color ?? '#6c757d', icono: c.icono ?? '' });
          this.loadingData.set(false);
        },
        error: () => { this.toastr.error('No se pudo cargar la categoría.'); this.router.navigate(['/categories']); },
      });
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const raw = this.form.value;
    this.categoryService.updateCategory(this.categoryId, {
      nombre: raw.nombre!,
      tipo: raw.tipo!,
      color: raw.color || '#6c757d',
      icono: raw.icono || '',
    }).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.loading.set(false); this.toastr.success('Categoría actualizada'); this.router.navigate(['/categories']); },
        error: () => this.loading.set(false),
      });
  }
}
