import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

import {
  getVentas,
  createVenta,
  anularVenta,
} from "@/api/ventas.api";

import { getPreparacionesVentas } from "@/api/preparaciones.api";

import type {
  Venta,
  VentaEstado,
  VentaMeta,
  CreateVentaRequest,
} from "@/features/ventas/types/venta.types";

import type {
  Preparacion,
  PreparacionApiListResponse,
} from "@/features/preparaciones/types/preparacion.type";


export const useVentas = () => {

  /* ============================
     STATES
  ============================ */

  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventasMeta, setVentasMeta] = useState<VentaMeta | null>(null);

  const [preparaciones, setPreparaciones] = useState<Preparacion[]>([]);
  const [preparacionesMeta, setPreparacionesMeta] = useState<any>(null);

  const [loadingVentas, setLoadingVentas] = useState(false);
  const [loadingPreparaciones, setLoadingPreparaciones] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingAnular, setLoadingAnular] = useState(false);

  const [ventasPage, setVentasPage] = useState(1);
  const [preparacionesPage, setPreparacionesPage] = useState(1);

  const [estadosVentas, setEstadosVentas] = useState<VentaEstado[]>(["PAGADA"]);


  /* ============================
     FETCH PREPARACIONES
  ============================ */

  const fetchPreparaciones = useCallback(async () => {
    try {

      setLoadingPreparaciones(true);

      const response: PreparacionApiListResponse = await getPreparacionesVentas(
        preparacionesPage
      );

      setPreparaciones(response.data);
      setPreparacionesMeta(response.meta);

    } catch (error) {

      toast.error("Error al cargar preparaciones");

    } finally {

      setLoadingPreparaciones(false);

    }
  }, [preparacionesPage]);


  /* ============================
     FETCH VENTAS
  ============================ */

  const fetchVentas = useCallback(async () => {
    try {

      setLoadingVentas(true);

      const response = await getVentas(estadosVentas, ventasPage);

      setVentas(response.data);
      setVentasMeta(response.meta);

    } catch (error) {

      toast.error("Error al cargar ventas");

    } finally {

      setLoadingVentas(false);

    }
  }, [ventasPage, estadosVentas]);


  /* ============================
     CREATE VENTA
  ============================ */

  const registrarVenta = useCallback(
    async (data: CreateVentaRequest) => {

      try {

        setLoadingCreate(true);

        await createVenta(data);

        toast.success("Venta registrada correctamente");

        await fetchVentas();
        await fetchPreparaciones();

      } catch (error: any) {

        toast.error(
          error?.response?.data?.message || "Error al registrar venta"
        );

        throw error;

      } finally {

        setLoadingCreate(false);

      }
    },
    [fetchVentas, fetchPreparaciones]
  );


  /* ============================
     ANULAR VENTA
  ============================ */

  const eliminarVenta = useCallback(
    async (id: string) => {

      try {

        setLoadingAnular(true);

        const response = await anularVenta(id);

        toast.success(response.message);

        await fetchVentas();
        await fetchPreparaciones();

      } catch (error: any) {

        toast.error(
          error?.response?.data?.message || "Error al anular venta"
        );

      } finally {

        setLoadingAnular(false);

      }
    },
    [fetchVentas, fetchPreparaciones]
  );


  /* ============================
     EFFECTS
  ============================ */

  useEffect(() => {

    fetchPreparaciones();

  }, [fetchPreparaciones]);


  useEffect(() => {

    fetchVentas();

  }, [fetchVentas]);


  /* ============================
     RETURN
  ============================ */

  return {

    /* data */
    ventas,
    preparaciones,
    ventasMeta,
    preparacionesMeta,

    /* loading */
    loadingVentas,
    loadingPreparaciones,
    loadingCreate,
    loadingAnular,

    /* pagination */
    ventasPage,
    preparacionesPage,
    setVentasPage,
    setPreparacionesPage,

    /* filtros */
    estadosVentas,
    setEstadosVentas,

    /* actions */
    registrarVenta,
    eliminarVenta,
    fetchVentas,
    fetchPreparaciones,
  };
};