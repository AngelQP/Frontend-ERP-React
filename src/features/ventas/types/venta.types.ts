/* ============================
   ESTADOS
============================ */
export type VentaEstado = "PAGADA" | "ANULADA";


/* ============================
   ENTIDAD PRINCIPAL
============================ */
export interface Venta {
  id: string;
  nombrePostre: string;
  fechaVenta: string; // ISO
  estado: VentaEstado;
  cantidad: number;
  precioUnitario: string; // viene como string desde backend
  total: string;
}


/* ============================
   META (PAGINACIÓN)
============================ */
export interface VentaMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}


/* ============================
   RESPUESTA LISTADO
============================ */
export interface VentaApiListResponse {
  data: Venta[];
  meta: VentaMeta;
}


/* ============================
   CREAR VENTA
============================ */
export interface CreateVentaRequest {
  preparacion_id: string;
  cantidad: number;
  precioUnitario: number;
}

export interface CreateVentaResponse {
  id: string;
  estado: VentaEstado;
  total: number;
  fechaVenta: string;
}


/* ============================
   ANULAR VENTA
============================ */
export interface AnularVentaResponse {
  message: string;
  ventaId: string;
  stockRestituido: number;
  stockActual: number;
  estadoPreparacion: string;
}

/* ============================
   Formulario de Venta
============================ */
export interface VentaFormData {
  preparacion_id: string;
  precioUnitario: number;
  cantidad: number;
}