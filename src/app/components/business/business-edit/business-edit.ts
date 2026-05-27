import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { BusinessService } from '../../../services/business.service';
import { Business, UpdateBusinessDto } from '../../../models/business.model';

@Component({
  selector: 'app-business-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './business-edit.html',
  styleUrl: './business-edit.css',
})
export class BusinessEdit implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(BusinessService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly businessId = signal<string>('');

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
    estado: ['activo' as const],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastr.error('ID de negocio no proporcionado');
      this.router.navigate(['/user/profile']);
      return;
    }

    this.businessId.set(id);
    this.loadBusiness(id);
  }

  loadBusiness(id: string): void {
    this.isLoading.set(true);
    this.service.getOne(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (business: Business) => {
          this.businessForm.patchValue({
            nombre: business.nombre,
            nit: business.nit,
            tipoEmpresa: business.tipoEmpresa,
            sector: business.sector,
            regimenTributario: business.regimenTributario,
            responsableIva: business.responsableIva,
            direccion: business.direccion || '',
            ciudad: business.ciudad || '',
            departamento: business.departamento || '',
            pais: business.pais || 'Colombia',
            codigoPostal: business.codigoPostal || '',
            telefono: business.telefono || '',
            email: business.email || '',
            sitioWeb: business.sitioWeb || '',
            descripcion: business.descripcion || '',
            estado: business.estado,
          });
          this.isLoading.set(false);
        },
        error: () => {
          this.toastr.error('Error al cargar negocio');
          this.router.navigate(['/user/profile']);
          this.isLoading.set(false);
        },
      });
  }

  onSubmit(): void {
    if (this.businessForm.invalid) {
      this.businessForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const raw = this.businessForm.value;

    const payload: UpdateBusinessDto = {
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
      estado: raw.estado,
    };

    this.service.update(this.businessId(), payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastr.success('Negocio actualizado exitosamente');
          this.router.navigate(['/user/profile']);
        },
        error: () => {
          this.toastr.error('Error al actualizar negocio');
          this.isSaving.set(false);
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/user/profile']);
  }
}
