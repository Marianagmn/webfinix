// src/app/models/business-finance.model.ts — alineado completamente con backend Finix
import { ApiResponse } from './api-response.model';

export type BusinessTransactionTipo =
  | 'cobrar'
  | 'pagar'
  | 'factura_venta'
  | 'factura_compra'
  | 'nomina'
  | 'activo_fijo'
  | 'nota_credito'
  | 'nota_debito'
  | 'anticipo'
  | 'devolucion';

export type BusinessTransactionEstado =
  | 'borrador'
  | 'pendiente'
  | 'aprobada'
  | 'contabilizada'
  | 'rechazada'
  | 'anulado'
  | 'en_disputa';

// DIAN e-invoicing metadata
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

// Tax breakdown
export interface Impuesto {
  tipo: 'iva' | 'retefuente' | 'reteiva' | 'reteica' | 'ica' | 'cree' | 'otro';
  tarifa: number;
  base: number;
  valor: number;
  concepto?: string;
  cuentaContable?: string;
}

// Approval step
export interface AprobacionStep {
  nivel: number;
  aprobadorId: string;
  rol?: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'delegado';
  comentario?: string;
  fecha?: string;
  delegadoA?: string;
}

// Recurrence configuration
export interface Recurrencia {
  frecuencia: 'diaria' | 'semanal' | 'quincenal' | 'mensual' | 'bimestral' | 'trimestral' | 'semestral' | 'anual';
  diaCiclo?: number;
  fechaInicio: string;
  fechaFin?: string;
  totalOcurrencias?: number;
  ocurrenciasEjecutadas: number;
  proximaEjecucion?: string;
  activa: boolean;
  transaccionesGeneradas: string[];
}

// Budget variance
export interface Presupuesto {
  presupuestoId: string;
  lineaPresupuestalId?: string;
  montoPresupuestado: number;
  montoEjecutado: number;
  variacion: number;
  porcentajeEjecucion: number;
}

// Fixed asset metadata
export interface ActivoFijo {
  fase: 'adquisicion' | 'en_uso' | 'depreciando' | 'dado_de_baja';
  codigoActivo?: string;
  vidaUtilAnios?: number;
  metodoDepreciacion: 'linea_recta' | 'saldo_decreciente' | 'unidades_produccion';
  valorResidual: number;
  depreciacionAcumulada: number;
  fechaAdquisicion?: string;
  fechaBajaActivo?: string;
  valorBaja?: number;
}

// Aging bucket
export interface Vencimiento {
  fechaVencimiento?: string | null;
  diasVencimiento?: number | null;
  bucket?: 'corriente' | 'vencido_30' | 'vencido_60' | 'vencido_90' | 'vencido_mas_90';
}

// Payment applied
export interface PagoAplicado {
  pagoId: string;
  monto: number;
  fecha: string;
}

// Accounting entry
export interface AsientoContable {
  cuentaPUC: string;
  nombreCuenta?: string;
  debito: number;
  credito: number;
  terceroId?: string;
  centroCostoId?: string;
  descripcion?: string;
}

// Main BusinessFinance interface
export interface BusinessFinance {
  id: string;
  businessId: string;
  userId: string;
  sucursalId?: string;
  tipo: BusinessTransactionTipo;
  monto: number;
  montoNeto: number;
  totalImpuestos: number;
  moneda: string;
  tasaCambio: number;
  montoCOP: number;
  categoria: string;
  cuentaOrigenId?: string;
  cuentaDestinoId?: string;
  metodoPago?: string;
  descripcion?: string;
  fecha: string;
  fechaContabilizacion?: string;
  estado: BusinessTransactionEstado;
  ejercicioFiscal: number;
  periodoContable: number;
  periodoContableCerrado: boolean;
  
  // Accounting fields
  cuentaContablePrincipal?: string;
  asientoContable?: AsientoContable[];
  
  // Taxes
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
  presupuesto?: Presupuesto;
  
  // Aprobación
  cadenaAprobacion: AprobacionStep[];
  nivelAprobacionRequerido: number;
  nivelAprobacionActual: number;
  
  // Recurrencia
  esRecurrente: boolean;
  recurrencia?: Recurrencia;
  transaccionOrigenId?: string;
  
  // A/R A/P
  esCuentaPorCobrar: boolean;
  esCuentaPorPagar: boolean;
  vencimiento?: Vencimiento;
  pagosAplicados: PagoAplicado[];
  saldoPendiente: number;
  
  // Activos fijos
  activoFijo?: ActivoFijo;
  
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
  
  // Virtual fields
  estaAprobado?: boolean;
  estaPagado?: boolean;
  etiqueta?: string;
}

// DTOs
export interface CreateBusinessFinanceDto {
  tipo: BusinessTransactionTipo;
  monto: number;
  moneda?: string;
  tasaCambio?: number;
  categoria: string;
  cuentaOrigenId?: string;
  cuentaDestinoId?: string;
  metodoPago?: string;
  descripcion?: string;
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
  esRecurrente?: boolean;
  recurrencia?: Recurrencia;
  impuestos?: Impuesto[];
}

export type UpdateBusinessFinanceDto = Partial<CreateBusinessFinanceDto>;

export interface ApplyPaymentDto {
  monto: number;
  fecha?: string;
  metodoPago: string;
  referencia?: string;
}

export type { ApiResponse };
