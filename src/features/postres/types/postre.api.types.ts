export interface PostreApiResponse {
  id: string;
  nombrePostre: string;
  descripcion?: string;
  precioVentaReferencia: string;
  rendimientoBase: number;
  receta: {
    id: string;
    nombre: string;
    cantidad: string;
  }[];
}