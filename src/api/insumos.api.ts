
import { api } from "@/lib/axios";
import type { InsumoRequestCreate, InsumoResponse } from "@/features/insumos/types/insumos.type";
import type { UnidadMedida } from "@/features/insumos/types/unidad-medida.types";


export const registerInsumo = async (payload: InsumoRequestCreate ): Promise<InsumoResponse> => {
    const { data } = await api.post<InsumoResponse>("/insumos", payload);
    return data;
}

export const getUnidadesMedida = async(): Promise<UnidadMedida[]> => {
    const { data } = await api.get<UnidadMedida[]>("/insumos/unidades");
    return data;
}

