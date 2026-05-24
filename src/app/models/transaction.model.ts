import { CategoryTipo } from './category.model';
import { MetodoPago, TransactionEstado } from './personal-finance.model';
import { ApiResponse, PaginatedResponse } from './api-response.model';

export type { ApiResponse, PaginatedResponse };

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
  metodoPago: MetodoPago | null;
  descripcion: string;
  fecha: string;
  estado: TransactionEstado;
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

export interface CreateBusinessFinanceDto {
  // REMOVED: businessId - Backend infers from req.user.businessId (JWT payload)
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
