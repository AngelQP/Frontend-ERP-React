export interface RecetaItem {
  insumo_id: string;
  cantidad: number;
}

export interface Postre {
  id: string;
  nombre: string;
  descripcion?: string;
  precio_referencia: number;
  rendimiento_base: number;
  receta: RecetaItem[];
}

export interface PostreFormData {
  nombre: string;
  descripcion?: string;
  precio_referencia: number;
  rendimiento_base: number;
  receta: RecetaItem[];
}

export interface PostreConCosto extends Postre {
  costo_total: number;
  margen: number;
}