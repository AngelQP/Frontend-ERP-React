
export interface Insumo {
  id: string;
  nombre: string;
  unidad_medida: string;
  cantidad_disponible: number;
  costo_unitario: number;
}

export interface InsumoCreateResponse {
  id: string;
  nombre: string;
  unidad: string;
}

export interface InsumoFormData {
  nombre: string;
  unidad_medida: string;
  // cantidad_disponible: number;
  // costo_unitario: number;
}

export interface InsumoRequestCreate {
    nombre: string;
    unidad: string;
}

export interface InsumoRequestUpdate {
    id: string;
    nombre: string;
    unidad: string;
}

export interface InsumosPaginadosResponse {
  data: Insumo[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}