import { apiPrivate } from "@/lib/axios";
import type {
  VentaApiListResponse,
  CreateVentaRequest,
  CreateVentaResponse,
  AnularVentaResponse,
} from "@/features/ventas/types/venta.types";


/* ============================
   CREATE
============================ */
export const createVenta = async (
  dataRequest: CreateVentaRequest
): Promise<CreateVentaResponse> => {

  const { data } = await apiPrivate.post<CreateVentaResponse>(
    "/ventas",
    dataRequest
  );

  return data;
};


/* ============================
   FIND ALL (con filtros)
============================ */
export const getVentas = async (
  estados: string[] = ["PAGADA"], // default
  page: number = 1
): Promise<VentaApiListResponse> => {

  const params = new URLSearchParams();

  const limit = 5;

  estados.forEach((e) => params.append("estado", e));

  params.append("page", page.toString());
  params.append("limit", limit.toString());

    

  const { data } = await apiPrivate.get<VentaApiListResponse>(
    `/ventas?${params.toString()}`
  );

  console.log(data);

  return data;
};


/* ============================
   ANULAR
============================ */
export const anularVenta = async (
  id: string
): Promise<AnularVentaResponse> => {

  const { data } = await apiPrivate.delete<AnularVentaResponse>(
    `/ventas/${id}`
  );

  return data;
};