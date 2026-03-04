import type { PostreApiResponse } from "../types/postre.api.types";
import type { Postre } from "../types/postre.types";

export const adaptPostreFromApi = ( apiPostre: PostreApiResponse ): Postre => {
  return {
    id: apiPostre.id,
    nombre: apiPostre.nombrePostre,
    descripcion: apiPostre.descripcion,
    precio_referencia: Number(apiPostre.precioVentaReferencia),
    rendimiento_base: Number(apiPostre.rendimientoBase),
    receta: apiPostre.receta.map((r) => ({
      insumo_id: r.id,
      cantidad: Number(r.cantidad),
    })),
  };
};