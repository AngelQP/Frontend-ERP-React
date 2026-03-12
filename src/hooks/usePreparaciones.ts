import type { Preparacion } from "@/features/preparaciones/types/preparacion.type";
import { preparacionesMock } from "@/mocks/preparacion.mock";
import { useState } from "react";

interface CreatePreparacionDto {
  postre_id: string;
  porcionesPlanificadas: number;
  porcionesReales: number;
}

export const usePreparaciones = () => {
  const [preparaciones, setPreparaciones] =
    useState<Preparacion[]>(preparacionesMock);

  const [isLoading, setIsLoading] = useState(false);

  const createPreparacion = async (data: CreatePreparacionDto) => {
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 500)); // simula API

    const nueva: Preparacion = {
      id: crypto.randomUUID(),
      postre_id: data.postre_id,
      nombrePostre: "Postre Mock",
      precioVentaReferencia: 10,
      porcionesPlanificadas: data.porcionesPlanificadas,
      porcionesReales: data.porcionesReales,
      porcionesDisponibles: data.porcionesReales,
      merma: data.porcionesPlanificadas - data.porcionesReales,
      estado: "ACTIVO",
      fechaPreparacion: new Date().toISOString(),
    };

    setPreparaciones((prev) => [nueva, ...prev]);

    setIsLoading(false);
  };

  const anularPreparacion = async (id: string) => {
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 400));

    setPreparaciones((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, estado: "ANULADO" } : p
      )
    );

    setIsLoading(false);
  };

  return {
    preparaciones,
    isLoading,
    createPreparacion,
    anularPreparacion,
  };
};