
import { apiPrivate } from "@/lib/axios";
import type { Insumo, InsumoCreateResponse, InsumoFormData } from "@/features/insumos/types/insumos.type";
import type { UnidadMedida } from "@/features/insumos/types/unidad-medida.types";


export const listarInsumosConStock = async (): Promise<Insumo[]> => {
    const { data } = await apiPrivate.get<Insumo[]>("/inventario-insumos");

    // console.log(data);

    // Se mapea los campos del backend al frontend
    return data.map((item: any) => ({
        id: item.insumo_id,
        nombre: item.nombre,
        unidad_medida: item.unidad,
        cantidad_disponible: item.stockActual ?? 0,
        costo_unitario: item.costoUnitario ?? 0,
    }))

    // return data;
}

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

