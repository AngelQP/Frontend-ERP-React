import type { DashboardChartItem, DashboardInventarioResponse, DashboardStatsResponse, DashboardTopProducto, DashboardVentaReciente } from "@/features/dashboard/types/dashboard.type";
import { apiPrivate } from "@/lib/axios";


/* ============================
   STATS
============================ */
export const getDashboardStats =
  async (): Promise<DashboardStatsResponse> => {

    const { data } = await apiPrivate.get<DashboardStatsResponse>(
      "/dashboard/stats"
    );

    return data;
  };


/* ============================
   CHART
============================ */
export const getDashboardChart =
  async (): Promise<DashboardChartItem[]> => {

    const { data } = await apiPrivate.get<DashboardChartItem[]>(
      "/dashboard/chart"
    );

    return data;
  };


/* ============================
   TOP PRODUCTOS
============================ */
export const getTopProductos =
  async (): Promise<DashboardTopProducto[]> => {

    const { data } = await apiPrivate.get<DashboardTopProducto[]>(
      "/dashboard/top-productos"
    );

    return data;
  };


/* ============================
   VENTAS RECIENTES
============================ */
export const getVentasRecientes =
  async (): Promise<DashboardVentaReciente[]> => {

    const { data } = await apiPrivate.get<DashboardVentaReciente[]>(
      "/dashboard/ventas-recientes"
    );

    return data;
  };


/* ============================
   INVENTARIO
============================ */
export const getDashboardInventario =
  async (): Promise<DashboardInventarioResponse> => {

    const { data } = await apiPrivate.get<DashboardInventarioResponse>(
      "/dashboard/inventario"
    );

    return data;
  };