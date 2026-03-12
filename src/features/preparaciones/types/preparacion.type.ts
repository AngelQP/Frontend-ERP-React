export interface Preparacion {
  id: string;
  postre_id: string;
  nombrePostre: string;
  precioVentaReferencia: number;
  porcionesPlanificadas: number;
  porcionesReales: number;
  porcionesDisponibles: number;
  merma: number;
  estado: "ACTIVO" | "ANULADO";
  fechaPreparacion: string;
}