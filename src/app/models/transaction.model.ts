// src/app/models/transaction.model.ts
import { CategoryType } from './category.model';

export type TransactionTipo = CategoryType;

export type { ApiResponse, PaginatedResponse };

export interface PersonalFinance {
  id: string;
  userId: string;
  tipo: CategoryType;
  monto: number;
  moneda: string;
  tasaCambio: number;
  categoria: string;
  cuentaOrigenId: string;
  categoria: string;
  cuentaOrigenId: string;
  cuentaDestinoId: string;
  metodoPago: MetodoPago | null;
  descripcion: string;
  fecha: string;
  estado: string;
  esAhorro: boolean;
  tags: string[];
  // Campos faltantes del backend - agregados para consistencia
  location?: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
  };
  source: 'manual' | 'ia' | 'importado';
  aiMetadata?: {
    clasificacion?: {
      categoriaSugerida?: string;
      confianza?: number;
    };
    analisis?: {
      patronDetectado?: string;
      alerta?: string;
    };
    predicciones?: {
      gastoMensual?: number;
    };
  };
  historialCambios?: Array<{
    campo: string;
    valorAnterior: any;
    valorNuevo: any;
    modificadoPor?: string;
    fecha: string;
  }>;
  createdBy?: string;
  updatedBy?: string;
  esTransferenciaInterna: boolean;
  transferenciaId?: string;
  notaTransaccion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonalFinanceDto {
  tipo: CategoryTipo;
  monto: number;
  moneda?: string;
  tasaCambio?: number;
  categoria: string;
  cuentaOrigenId?: string;
  cuentaDestinoId?: string;
  metodoPago?: string;
  descripcion?: string;
  fecha?: string;
  estado?: string;
  esAhorro?: boolean;
  tags?: string[];
}

export interface UpdatePersonalFinanceDto extends Partial<CreatePersonalFinanceDto> {}

export interface CreatePersonalFinanceRequest {
  tipo: CategoryTipo;
  monto: number;
  moneda?: string;
  tasaCambio?: number;
  categoria?: string;
  cuentaOrigenId?: string;
  cuentaDestinoId?: string;
  metodoPago?: string;
  descripcion?: string;
  fecha?: string;
  estado?: string;
  esAhorro?: boolean;
  tags?: string[];
}

export interface UpdatePersonalFinanceRequest extends Partial<CreatePersonalFinanceRequest> {}

export interface TransactionFilter {
  page?: number;
  perPage?: number;
  from?: string;
  to?: string;
  tipo?: CategoryType | CategoryType[];
  categoriaId?: string;
  cuentaOrigenId?: string;
  order?: 'asc' | 'desc';
}

export type BusinessFinanceStatus = 'borrador' | 'pendiente' | 'aprobada' | 'contabilizada' | 'rechazada';

export interface BusinessFinance {
  id: string;
  businessId: string;
  tipo: 'cobrar' | 'pagar';
  monto: number;
  montoNeto: number;
  totalImpuestos: number;
  moneda: string;
  tasaCambio: number;
  montoCOP: number;
  categoria: string;
  cuentaOrigenId?: string;
  cuentaDestinoId?: string;
  metodoPago: MetodoPago | null;
  descripcion: string;
  fecha: string;
  fechaContabilizacion?: string;
  estado: BusinessFinanceStatus;
  ejercicioFiscal: number;
  periodoContable: number;
  periodoContableCerrado: boolean;
  // Accounting fields
  cuentaContablePrincipal?: string;
  asientoContable?: Array<{
    cuentaPUC: string;
    nombreCuenta?: string;
    debito: number;
    credito: number;
    terceroId?: string;
    centroCostoId?: string;
    descripcion?: string;
  }>;
  // Impuestos
  tarifaIVA: number;
  ivaDescontable: boolean;
  tarifaRetefuente: number;
  tarifaReteICA: number;
  tarifaReteIVA: number;
  impuestos: Impuesto[];
  // DIAN
  dian?: DianMetadata;
  facturaElectronica: boolean;
  numeroDocumento?: string;
  tipoDocumento?: string;
  documentosSoporte?: Array<{
    nombre: string;
    url: string;
    tipo: string;
    fechaSubida: string;
  }>;
  // Terceros
  terceroId?: string;
  tipoTercero?: 'proveedor' | 'cliente' | 'empleado' | 'accionista' | 'entidad_publica' | 'otro';
  // Cost allocation
  centroCostoId?: string;
  departamentoId?: string;
  proyectoId?: string;
  porcentajeAsignacion: number;
  // Presupuesto
  presupuesto?: {
    presupuestoId: string;
    lineaPresupuestalId?: string;
    montoPresupuestado: number;
    montoEjecutado: number;
    variacion: number;
    porcentajeEjecucion: number;
  };
  // Aprobación
  cadenaAprobacion: AprobacionStep[];
  nivelAprobacionRequerido: number;
  nivelAprobacionActual: number;
  // Recurrencia
  esRecurrente: boolean;
  recurrencia?: {
    frecuencia: 'diaria' | 'semanal' | 'quincenal' | 'mensual' | 'bimestral' | 'trimestral' | 'semestral' | 'anual';
    diaCiclo?: number;
    fechaInicio: string;
    fechaFin?: string;
    totalOcurrencias?: number;
    ocurrenciasEjecutadas: number;
    proximaEjecucion?: string;
    activa: boolean;
    transaccionesGeneradas: string[];
  };
  transaccionOrigenId?: string;
  // A/R A/P
  esCuentaPorCobrar: boolean;
  esCuentaPorPagar: boolean;
  vencimiento?: Vencimiento;
  pagosAplicados: Array<{
    pagoId: string;
    monto: number;
    fecha: string;
  }>;
  saldoPendiente: number;
  // Activos fijos
  activoFijo?: {
    fase: 'adquisicion' | 'en_uso' | 'depreciando' | 'dado_de_baja';
    codigoActivo?: string;
    vidaUtilAnios?: number;
    metodoDepreciacion: 'linea_recta' | 'saldo_decreciente' | 'unidades_produccion';
    valorResidual: number;
    depreciacionAcumulada: number;
    fechaAdquisicion?: string;
    fechaBajaActivo?: string;
    valorBaja?: number;
    proveedorId?: string;
    ubicacion?: string;
    numeroSerie?: string;
  };
  // Flags
  esTransferenciaInterna: boolean;
  transferenciaId?: string;
  esAhorro: boolean;
  // Location
  location?: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
  };
  // AI Metadata extendido
  aiMetadata?: {
    clasificacion?: {
      categoriaSugerida?: string;
      confianza?: number;
    };
    analisis?: {
      patronDetectado?: string;
      alerta?: string;
      anomalia?: boolean;
    };
    predicciones?: {
      gastoMensual?: number;
      riesgoLiquidez?: number;
    };
    conciliacion?: {
      matchBancario?: boolean;
      idExtractoId?: string;
      fechaConciliacion?: string;
    };
  };
  // Reversal
  transaccionReversadaId?: string;
  esReverso: boolean;
  motivoAnulacion?: string;
  // Audit trail
  historialCambios?: Array<{
    campo: string;
    valorAnterior: any;
    valorNuevo: any;
    modificadoPor?: string;
    razonCambio?: string;
    ipOrigen?: string;
    fecha: string;
  }>;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  isDeleted: boolean;
  deletedAt?: string;
  notaTransaccion?: string;
  createdAt: string;
  updatedAt: string;
  // Virtual fields from backend
  estaAprobado?: boolean;
  estaPagado?: boolean;
  etiqueta?: string;
}

export interface CreateBusinessFinanceRequest {
  businessId: string;
  tipo: 'cobrar' | 'pagar';
  monto: number;
  clienteId: string;
  fechaVencimiento: string;
}

export interface UpdateBusinessFinanceRequest extends Partial<CreateBusinessFinanceRequest> {}

export interface CreateBusinessFinanceDTO {
  businessId: string;
  tipo: 'cobrar' | 'pagar';
  monto: number;
  clienteId: string;
  fechaVencimiento: string;
}

export interface UpdateBusinessFinanceDTO extends Partial<CreateBusinessFinanceDTO> {}