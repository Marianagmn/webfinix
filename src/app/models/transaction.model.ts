import { CategoryTipo } from './category.model';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: any;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PersonalFinance {
  id: string;
  userId: string;
  tipo: CategoryTipo;
  monto: number;
  moneda: string;
  tasaCambio: number;
  categoria: string;
  cuentaOrigenId: string;
  cuentaDestinoId: string;
  metodoPago: string;
  descripcion: string;
  fecha: string;
  estado: string;
  esAhorro: boolean;
  tags: string[];
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
  descripcion: string;
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
  categoria: string;
  cuentaOrigenId?: string;
  cuentaDestinoId?: string;
  metodoPago?: string;
  descripcion: string;
  fecha?: string;
  estado?: string;
  esAhorro?: boolean;
  tags?: string[];
}

export interface UpdatePersonalFinanceRequest extends Partial<CreatePersonalFinanceRequest> {}

export type BusinessFinanceStatus = 'borrador' | 'pendiente' | 'aprobada' | 'contabilizada' | 'rechazada' | 'anulado' | 'en_disputa';

export interface Impuesto {
  tipo: 'iva' | 'retefuente' | 'reteiva' | 'reteica' | 'ica' | 'cree' | 'otro';
  tarifa: number;
  base: number;
  valor: number;
  concepto?: string;
  cuentaContable?: string;
}

export interface DianMetadata {
  cufe?: string;
  qr?: string;
  numeroResolucion?: string;
  fechaResolucion?: string;
  rangoInicial?: number;
  rangoFinal?: number;
  prefijo?: string;
  consecutivo?: number;
  claveTecnica?: string;
  estadoDIAN?: 'pendiente' | 'aceptada' | 'rechazada' | 'contingencia';
  xmlRespuesta?: string;
  ultimaSincronizacion?: string;
}

export interface AprobacionStep {
  nivel: number;
  aprobadorId: string;
  rol?: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'delegado';
  comentario?: string;
  fecha?: string;
  delegadoA?: string;
}

export interface Vencimiento {
  fechaVencimiento: string;
  montoPendiente: number;
  diasVencido: number;
  bucket: 'corriente' | 'vencido_30' | 'vencido_60' | 'vencido_90' | 'vencido_mas_90';
  recordatoriosEnviados: number;
  ultimoRecordatorio?: string;
}

export interface BusinessFinance {
  id: string;
  businessId: string;
  userId: string;
  sucursalId?: string;
  tipo: 'cobrar' | 'pagar' | 'factura_venta' | 'factura_compra' | 'nomina' | 'activo_fijo';
  monto: number;
  montoNeto: number;
  totalImpuestos: number;
  moneda: string;
  tasaCambio: number;
  montoCOP: number;
  categoria: string;
  cuentaOrigenId?: string;
  cuentaDestinoId?: string;
  metodoPago: string;
  descripcion: string;
  fecha: string;
  fechaContabilizacion?: string;
  estado: BusinessFinanceStatus;
  ejercicioFiscal: number;
  periodoContable: number;
  periodoContableCerrado: boolean;
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
  // Terceros
  terceroId?: string;
  tipoTercero?: 'proveedor' | 'cliente' | 'empleado' | 'accionista' | 'entidad_publica' | 'otro';
  // Cost allocation
  centroCostoId?: string;
  departamentoId?: string;
  proyectoId?: string;
  porcentajeAsignacion: number;
  // Aprobación
  cadenaAprobacion: AprobacionStep[];
  nivelAprobacionRequerido: number;
  nivelAprobacionActual: number;
  // A/R A/P
  esCuentaPorCobrar: boolean;
  esCuentaPorPagar: boolean;
  vencimiento?: Vencimiento;
  pagosAplicados: any[];
  saldoPendiente: number;
  // Recurrencia
  esRecurrente: boolean;
  transaccionOrigenId?: string;
  // Flags
  esTransferenciaInterna: boolean;
  transferenciaId?: string;
  esAhorro: boolean;
  // AI Metadata
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
  };
  // Reversal
  transaccionReversadaId?: string;
  esReverso: boolean;
  motivoAnulacion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusinessFinanceDto {
  businessId: string;
  tipo: 'cobrar' | 'pagar' | 'factura_venta' | 'factura_compra' | 'nomina' | 'activo_fijo';
  monto: number;
  moneda?: string;
  tasaCambio?: number;
  categoria: string;
  cuentaOrigenId?: string;
  cuentaDestinoId?: string;
  metodoPago?: string;
  descripcion: string;
  fecha?: string;
  terceroId?: string;
  tipoTercero?: string;
  centroCostoId?: string;
  departamentoId?: string;
  proyectoId?: string;
  tarifaIVA?: number;
  tarifaRetefuente?: number;
  tarifaReteICA?: number;
  tarifaReteIVA?: number;
  facturaElectronica?: boolean;
  numeroDocumento?: string;
  tipoDocumento?: string;
  ejercicioFiscal?: number;
  periodoContable?: number;
}

export interface UpdateBusinessFinanceDto extends Partial<CreateBusinessFinanceDto> {}
