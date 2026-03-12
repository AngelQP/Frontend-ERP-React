import type { Preparacion } from "@/features/preparaciones/types/preparacion.type";

export const preparacionesMock: Preparacion[] = [
  {
    id: "1",
    postre_id: "p1",
    nombrePostre: "Cheesecake",
    precioVentaReferencia: 15,
    porcionesPlanificadas: 12,
    porcionesReales: 11,
    porcionesDisponibles: 11,
    merma: 1,
    estado: "ACTIVO",
    fechaPreparacion: "2026-03-10",
  },
  {
    id: "2",
    postre_id: "p2",
    nombrePostre: "Tres Leches",
    precioVentaReferencia: 12,
    porcionesPlanificadas: 10,
    porcionesReales: 10,
    porcionesDisponibles: 10,
    merma: 0,
    estado: "ACTIVO",
    fechaPreparacion: "2026-03-09",
  },
];