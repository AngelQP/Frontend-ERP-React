import { useQuery } from "@tanstack/react-query";

import {
  getDashboardStats,
  getDashboardChart,
  getTopProductos,
  getVentasRecientes,
  getDashboardInventario,
} from "../api/dashboard.api";


export const useDashboard = () => {

  /* ============================
     STATS
  ============================ */
  const statsQuery = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  /* ============================
     CHART
  ============================ */
  const chartQuery = useQuery({
    queryKey: ["dashboard-chart"],
    queryFn: getDashboardChart,
  });

  /* ============================
     TOP PRODUCTOS
  ============================ */
  const topProductosQuery = useQuery({
    queryKey: ["dashboard-top-productos"],
    queryFn: getTopProductos,
  });

  /* ============================
     VENTAS RECIENTES
  ============================ */
  const ventasRecientesQuery = useQuery({
    queryKey: ["dashboard-ventas-recientes"],
    queryFn: getVentasRecientes,
  });

  /* ============================
     INVENTARIO
  ============================ */
  const inventarioQuery = useQuery({
    queryKey: ["dashboard-inventario"],
    queryFn: getDashboardInventario,
  });

   /* ============================
        CALCULO CHANGE
    ============================ */

    const chart = chartQuery.data || [];

    const lastMonth = chart[chart.length - 1];
    const previousMonth = chart[chart.length - 2];

    const calcPercentage = (current?: number, previous?: number) => {
        if (!previous || previous === 0) return 0;
        return ((current! - previous) / previous) * 100;
    };

    const ingresosChange = calcPercentage(
        lastMonth?.ventas,
        previousMonth?.ventas
    );

    const gastosChange = calcPercentage(
        lastMonth?.gastos,
        previousMonth?.gastos
    );

  return {

    /* stats */
    stats: statsQuery.data,
    statsLoading: statsQuery.isLoading,

    /* chart */
    chart: chartQuery.data || [],
    chartLoading: chartQuery.isLoading,

    /* top productos */
    topProductos: topProductosQuery.data || [],
    topProductosLoading: topProductosQuery.isLoading,

    /* ventas recientes */
    ventasRecientes: ventasRecientesQuery.data || [],
    ventasRecientesLoading: ventasRecientesQuery.isLoading,

    /* inventario */
    inventario: inventarioQuery.data,
    inventarioLoading: inventarioQuery.isLoading,

    /* changes */
    ingresosChange,
    gastosChange,
  };
};