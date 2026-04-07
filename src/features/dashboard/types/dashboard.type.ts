/* ============================
   STATS
============================ */
export interface DashboardStatsResponse {
  ingresosMes: number;
  gastosMes: number;
  balance: number;
  ventasMes: number;
  ventasSemana: number;
}

/* ============================
   CHART
============================ */
export interface DashboardChartItem {
  name: string;
  ventas: number;
  gastos: number;
}

/* ============================
   TOP PRODUCTOS
============================ */
export interface DashboardTopProducto {
  name: string;
  ventas: number;
}

/* ============================
   VENTAS RECIENTES
============================ */
export interface DashboardVentaReciente {
  id: string;
  product: string;
  quantity: number;
  total: number;
  time: string;
}

/* ============================
   INVENTARIO
============================ */
export interface DashboardInventarioResponse {
  insumosDisponibles: number;
  stockBajo: number;
  postresActivos: number;
  ventasHoy: number;
}