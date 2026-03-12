import { Cake, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Preparacion } from "@/features/preparaciones/types/preparacion.type";

interface Props {
  preparacion: Preparacion;
  onAnular: (id: string) => void;
}

export default function PreparacionCard({ preparacion, onAnular }: Props) {
  return (
    <div className="border rounded-lg p-4 space-y-3 shadow-sm hover:shadow-md transition">

      <div className="flex items-center gap-2">
        <Cake size={20} />
        <h3 className="font-semibold text-lg">
          {preparacion.nombrePostre}
        </h3>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>Planificadas: {preparacion.porcionesPlanificadas}</p>
        <p>Reales: {preparacion.porcionesReales}</p>
        <p>Disponibles: {preparacion.porcionesDisponibles}</p>
        <p>Merma: {preparacion.merma}</p>
        <p>Precio ref: S/ {preparacion.precioVentaReferencia}</p>
        <p>Fecha: {preparacion.fechaPreparacion}</p>
      </div>

      <div className="flex justify-between items-center pt-2">

        <span
          className={`text-xs px-2 py-1 rounded ${
            preparacion.estado === "ACTIVO"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {preparacion.estado}
        </span>

        {preparacion.estado === "ACTIVO" && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onAnular(preparacion.id)}
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}