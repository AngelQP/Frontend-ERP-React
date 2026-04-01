
import { apiPrivate } from "@/lib/axios";
import type { Insumo, InsumoCreateResponse, InsumoFormData, InsumosPaginadosResponse } from "@/features/insumos/types/insumos.type";
import type { UnidadMedida } from "@/features/insumos/types/unidad-medida.types";

export const listarInsumosConStock = async (
  page: number = 1,
  limit: number = 4
): Promise<InsumosPaginadosResponse> => {

  const { data } = await apiPrivate.get("/inventario-insumos", {
    params: { page, limit }
  });

  return {
    data: data.data.map((item: any) => ({
      id: item.insumo_id,
      nombre: item.nombre,
      unidad_medida: item.unidad,
      cantidad_disponible: item.stockActual ?? 0,
      costo_unitario: item.costoUnitario ?? 0,
    })),
    meta: data.meta
  };
};

export const createInsumoApi= async (payload: InsumoFormData ): Promise<Insumo> => {

    const dto = {
        nombre: payload.nombre,
        unidad: payload.unidad_medida
    }

    const { data } = await apiPrivate.post<InsumoCreateResponse>("/insumos", dto);
    // Retornamos el objeto creado con valores iniciales para stock y precio
    return {
        id: data.id,
        nombre: data.nombre,
        unidad_medida: data.unidad,
        cantidad_disponible: 0,
        costo_unitario: 0
    };
}

export const getUnidadesMedida = async(): Promise<UnidadMedida[]> => {
    const { data } = await apiPrivate.get<UnidadMedida[]>("/insumos/unidades");
    return data;
}

export const eliminarInsumoApi = async (id: string): Promise<void> => {
    const {data} = await apiPrivate.delete(`/insumos/${id}`);
    return data;
}
