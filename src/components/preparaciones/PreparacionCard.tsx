import { Cake, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Preparacion } from "@/features/preparaciones/types/preparacion.type";
import { formatDate } from "@/features/preparaciones/helper/preparacion.helper";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface Props {
  preparacion: Preparacion;
  onAnular: (id: string) => void;
}

export default function PreparacionCard({ preparacion, onAnular }: Props) {

  const [isDeleting, setIsDeleting] = useState(false);

  const estadoStyles = {
    ACTIVA: "bg-green-100 text-green-700",
    FINALIZADA: "bg-blue-100 text-blue-700",
    ANULADA: "bg-red-100 text-red-700",
    "EN VENTA": "bg-yellow-100 text-yellow-800",
  };

  const handleConfirmAnular = async () => {
    try {
      setIsDeleting(true);
      await onAnular(preparacion.id);
    } finally {
      setIsDeleting(false);
    }
  };


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
        <p>Fecha: {formatDate(preparacion.fechaPreparacion)}</p>
      </div>

      <div className="flex justify-between items-center pt-2">

        <span
          className={`text-xs px-2 py-1 rounded ${estadoStyles[preparacion.estado]}`}
        >
          {preparacion.estado.charAt(0)+preparacion.estado.slice(1).toLocaleLowerCase()}
        </span>

        {preparacion.estado === "ACTIVA" && (

          <AlertDialog>

            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive">
                <Trash2 size={16} />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>

              <AlertDialogHeader>
                <AlertDialogTitle>
                  Anular preparación
                </AlertDialogTitle>

                <AlertDialogDescription>
                  ¿Seguro que deseas anular la preparación de{" "}
                  <strong>{preparacion.nombrePostre}</strong>?
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>

                <AlertDialogCancel disabled={isDeleting}>
                  Cancelar
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleConfirmAnular}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? "Anulando..." : "Anular"}
                </AlertDialogAction>

              </AlertDialogFooter>

            </AlertDialogContent>

          </AlertDialog>

        )}
      </div>
    </div>
  );
}