import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { BusinessService } from '../../../services/business.service';
import { CreateBusinessDto } from '../../../models/business.model';

@Component({
  selector: 'app-business-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './business-create.html',
  styleUrl: './business-create.css',
})
export class BusinessCreate implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(BusinessService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isSaving = signal(false);

  businessForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    nit: ['', [Validators.required, Validators.pattern(/^\d{9,11}$/)]],
    tipoEmpresa: ['persona_juridica' as const],
    sector: ['servicios' as const],
    regimenTributario: ['comun' as const],
    responsableIva: [false],
    direccion: [''],
    ciudad: [''],
    departamento: [''],
    pais: ['Colombia'],
    codigoPostal: [''],
    telefono: [''],
    email: ['', [Validators.email]],
    sitioWeb: [''],
    descripcion: ['', [Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    // Form is already initialized with default values
  }

  onSubmit(): void {
    if (this.businessForm.invalid) {
      this.businessForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const raw = this.businessForm.value;

    const payload: CreateBusinessDto = {
      nombre: raw.nombre,
      nit: raw.nit,
      tipoEmpresa: raw.tipoEmpresa,
      sector: raw.sector,
      regimenTributario: raw.regimenTributario,
      responsableIva: raw.responsableIva,
      direccion: raw.direccion || undefined,
      ciudad: raw.ciudad || undefined,
      departamento: raw.departamento || undefined,
      pais: raw.pais || 'Colombia',
      codigoPostal: raw.codigoPostal || undefined,
      telefono: raw.telefono || undefined,
      email: raw.email || undefined,
      sitioWeb: raw.sitioWeb || undefined,
      descripcion: raw.descripcion || undefined,
    };

    this.service.create(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastr.success('Negocio creado exitosamente');
          this.router.navigate(['/user/profile'], {
            queryParams: { message: 'business_created' }
          });
        },
        error: () => {
          this.toastr.error('Error al crear negocio');
          this.isSaving.set(false);
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/user/profile']);
  }
}
