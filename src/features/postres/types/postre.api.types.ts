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

export interface PostrePaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PostreListApiResponse {
  data: PostreApiResponse[];
  meta: PostrePaginationMeta;
}