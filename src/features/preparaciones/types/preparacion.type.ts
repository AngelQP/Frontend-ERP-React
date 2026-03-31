/* ============================
   PREPARACION
============================ */
export interface Preparacion {
  id: string;
  postre_id: string;
  nombrePostre: string;
  precioVentaReferencia: number;
  porcionesPlanificadas: number;
  porcionesReales: number;
  porcionesDisponibles: number;
  merma: number;
  estado: "ACTIVA" | "ANULADA" | "FINALIZADA" | "EN VENTA";
  fechaPreparacion: string;
}

/* ============================
   PREPARACION
============================ */
export interface PreparacionVenta {
  id: string;
  nombrePostre: string;
  precioVentaReferencia: number;
  porcionesReales: number;
  porcionesDisponibles: number;
  merma: number;
  estado: "ACTIVA" | "ANULADA" | "FINALIZADA";
  fechaPreparacion: string;
}

/* ============================
   PAGINACION
============================ */
export interface PreparacionApiMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}


/* ============================
   LIST RESPONSE
============================ */
export interface PreparacionApiListResponse {
  data: Preparacion[];
  meta: PreparacionApiMeta;
}

/* ============================
   ANULAR
============================ */
export interface AnularPreparacionResponse {
  message: string;
  preparacion_id: string;
}

/* ============================
   CREAR PREPARACION
============================ */
export interface CreatePreparacionRequest {
  postre_id: string;
  porcionesPlanificadas: number;
  porcionesReales: number;
}

/* ============================
   ESTADOS
============================ */
export interface EstadoPreparacionApi {
  value: "ACTIVA" | "FINALIZADA" | "ANULADA";
  label: string;
}