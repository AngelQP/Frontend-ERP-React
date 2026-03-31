import { useState, useEffect } from "react";

import type { CreatePreparacionRequest, Preparacion, PreparacionApiMeta } from "@/features/preparaciones/types/preparacion.type";

import {
  getPreparaciones,
  createPreparacion as createPreparacionApi,
  anularPreparacion as anularPreparacionApi,
  getEstadosPreparacion,
} from "@//api/preparaciones.api";
import { adaptPreparacionFromApi } from "@/features/preparaciones/adapters/preparacion.adapter";
import { toast } from "sonner";



export const usePreparaciones = () => {
  const [preparaciones, setPreparaciones] = useState<Preparacion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [estadosDisponibles, setEstadosDisponibles] = useState<string[]>([]);

  const [meta, setMeta] = useState<PreparacionApiMeta | null>(null);
  const [page, setPage] = useState(1);

  const ESTADOS_DEFAULT = [
    "ACTIVA",
    "EN VENTA",
    "FINALIZADA",
  ];

  const fetchEstadosPreparacion = async () => {
    try {
      const data = await getEstadosPreparacion();

      const estados = data.map((e) => e.value);

      setEstadosDisponibles(estados);

    } catch (error) {
      console.error("Error cargando estados de preparación", error);
    }
  };

  /* ============================
     LOAD DATA
  ============================ */
  const fetchPreparaciones = async (
    pageNumber = 1,
    estados: string[]
  ) => {
    try {
      setIsLoading(true);

      const response = await getPreparaciones(estados, pageNumber);

      const mapped = response.data.map(adaptPreparacionFromApi);

      setPreparaciones(mapped);

      setMeta(response.meta);
      setPage(response.meta.page);
    } catch (error) {
      console.error("Error cargando preparaciones", error);
    } finally {
      setIsLoading(false);
    }
  };

  /* ============================
     CREATE
  ============================ */
  const createPreparacion = async (data: CreatePreparacionRequest) => {
    try {
      setIsLoading(true);

      await createPreparacionApi(data);

      toast.success("Preparación creada correctamente");

      await fetchPreparaciones(1, ESTADOS_DEFAULT);
    } catch (error) {
      toast.error("Error al crear la preparación");
    } finally {
      setIsLoading(false);
    }
  };

  /* ============================
     ANULAR
  ============================ */
  const anularPreparacion = async (id: string) => {
    try {
      setIsLoading(true);

      const response = await anularPreparacionApi(id);

      await fetchPreparaciones(1, ESTADOS_DEFAULT);

      toast.success(response.message);

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al anular la preparación");
    } finally {
      setIsLoading(false);
    }
  };

  /* ============================
     EFFECT
  ============================ */

  useEffect(() => {
    fetchEstadosPreparacion();
  }, []);

  return {
    preparaciones,
    isLoading,
    createPreparacion,
    anularPreparacion,
    estadosDisponibles,
    meta,
    page,
    fetchPreparaciones,
    setPage
  };
};