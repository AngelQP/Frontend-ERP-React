import type { Postre, PostreFormData } from "@/features/postres/types/postre.types";
import type { PostreApiResponse } from "@/features/postres/types/postre.api.types";
import { adaptPostreFromApi } from "@/features/postres/adapters/postre.adapter";
import { apiPrivate } from "@/lib/axios";

/* ============================
   CREATE
============================ */
export const createPostre = async (
  payload: PostreFormData
): Promise<Postre> => {
  const { data } = await apiPrivate.post<PostreApiResponse>("/postres", {
    nombrePostre: payload.nombre,
    descripcion: payload.descripcion,
    precioVentaReferencia: payload.precio_referencia,
    rendimientoBase: payload.rendimiento_base,
    receta: payload.receta.map((r) => ({
      insumo_id: r.insumo_id,
      cantidad: r.cantidad,
    })),
  });

  return adaptPostreFromApi(data);
};

/* ============================
   UPDATE
============================ */
export const updatePostre = async (
  id: string,
  payload: PostreFormData
): Promise<Postre> => {
  const { data } = await apiPrivate.put<PostreApiResponse>(
    `/postres/${id}`,
    {
      nombrePostre: payload.nombre,
      descripcion: payload.descripcion,
      precioVentaReferencia: payload.precio_referencia,
      rendimientoBase: payload.rendimiento_base,
      receta: payload.receta.map((r) => ({
        insumo_id: r.insumo_id,
        cantidad: r.cantidad,
      })),
    }
  );

  return adaptPostreFromApi(data);
};

/* ============================
   DELETE
============================ */
export const deletePostre = async (id: string): Promise<void> => {
  await apiPrivate.delete(`/postres/${id}`);
};

/* ============================
   FIND ALL
============================ */
export const getPostres = async (): Promise<Postre[]> => {
    const { data } = await apiPrivate.get<PostreApiResponse[]>("/postres");

    const mapped = data.map(adaptPostreFromApi);

    // console.log("DATA MAPEADA DEL BACKEND:", { mapped });

    return mapped;
};