// src/app/models/business.model.ts — alineado con backend Finix
import { ApiResponse } from './api-response.model';

export type TipoEmpresa = 'persona_natural' | 'persona_juridica' | 'entidad_gubernamental';
export type Sector = 'comercio' | 'servicios' | 'manufactura' | 'tecnologia' | 'salud' | 'educacion' | 'construccion' | 'otro';
export type RegimenTributario = 'simplificado' | 'comun' | 'gran_contribuyente';
export type EstadoNegocio = 'activo' | 'inactivo' | 'suspendido';

export interface Business {
  id: string;
  nombre: string;
  nit: string;
  tipoEmpresa: TipoEmpresa;
  sector: Sector;
  regimenTributario: RegimenTributario;
  responsableIva: boolean;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
  pais: string;
  codigoPostal?: string;
  telefono?: string;
  email?: string;
  sitioWeb?: string;
  estado: EstadoNegocio;
  descripcion?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusinessDto {
  nombre: string;
  nit: string;
  tipoEmpresa?: TipoEmpresa;
  sector?: Sector;
  regimenTributario?: RegimenTributario;
  responsableIva?: boolean;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
  pais?: string;
  codigoPostal?: string;
  telefono?: string;
  email?: string;
  sitioWeb?: string;
  descripcion?: string;
  logoUrl?: string;
}

export interface UpdateBusinessDto extends Partial<CreateBusinessDto> {
  estado?: EstadoNegocio;
}

export interface BusinessListParams {
  estado?: EstadoNegocio;
  tipoEmpresa?: TipoEmpresa;
  sector?: Sector;
  regimenTributario?: RegimenTributario;
  page?: number;
  limit?: number;
  sort?: string;
}

export type { ApiResponse };
