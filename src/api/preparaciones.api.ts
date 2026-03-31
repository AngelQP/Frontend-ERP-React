import type { 
  AnularPreparacionResponse, 
  CreatePreparacionRequest, 
  EstadoPreparacionApi, 
  Preparacion, 
  PreparacionApiListResponse } from "@/features/preparaciones/types/preparacion.type";
import { apiPrivate } from "@/lib/axios";



/* ============================
   CREATE
============================ */
export const createPreparacion = async (
  dataRequest: CreatePreparacionRequest
): Promise<Preparacion> => {

  const { data } = await apiPrivate.post<Preparacion>(
    "/preparaciones",
    dataRequest
  );

  return data ;
};


/* ============================
   ANULAR
============================ */
export const anularPreparacion = async (
  id: string
): Promise<AnularPreparacionResponse> => {

  const { data } = await apiPrivate.delete(`/preparaciones/${id}`, {
    data: {
      estado: "ANULADA"
    }
  });

  return data;

};


/* ============================
   FIND ALL
============================ */
export const getPreparaciones = async (
  estados: string[],
  page: number
): Promise<PreparacionApiListResponse> => {

  const params = new URLSearchParams();

  const limit = 6;

  estados.forEach((e) => params.append("estado", e));

  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const { data } = await apiPrivate.get<PreparacionApiListResponse>(
    `/preparaciones?${params.toString()}`
  );

  return data;
};

/* ============================
   FIND ALL
============================ */
export const getPreparacionesVentas = async (
  page: number
): Promise<PreparacionApiListResponse> => {

  const params = new URLSearchParams();

  const limit = 6;

  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const { data } = await apiPrivate.get<PreparacionApiListResponse>(
    `/preparaciones/ventas?${params.toString()}`
  );

  return data;
};


/* ============================
   ESTADOS DISPONIBLES
============================ */
export const getEstadosPreparacion = async (): Promise<
  EstadoPreparacionApi[]
> => {

  const { data } = await apiPrivate.get<EstadoPreparacionApi[]>(
    "/preparaciones/estados"
  );

  return data;
};