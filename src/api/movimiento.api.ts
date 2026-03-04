import { apiPrivate } from "@/lib/axios";

export interface MovimientoPayload {
  tipo: "INGRESO" | "SALIDA" | "AJUSTE" | "MERMA";
  insumo_id: string;
  cantidad: number;
  costoUnitario?: number;
  motivo?: string;
}

export const crearMovimientoApi = async (payload: MovimientoPayload) => {
  const { data } = await apiPrivate.post(
    "/movimientos-insumos",
    payload
  );

  // console.log("Payload enviado al backend:", payload);

  console.log("Respuesta del backend:", data);

  return data;
};
