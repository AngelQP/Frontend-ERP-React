import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { type Insumo } from "@/types";

interface StockBajoAlertProps {
  insumos: Insumo[];
  umbral: number;
}

const StockBajoAlert = ({ insumos, umbral }: StockBajoAlertProps) => {
  if (insumos.length === 0) return null;

  return (
    <Alert variant="destructive" className="mb-6 border-warning bg-warning/10">
      <AlertTriangle className="h-4 w-4 text-warning" />
      <AlertTitle className="text-warning">Stock bajo</AlertTitle>
      <AlertDescription className="text-warning/80">
        Los siguientes insumos tienen stock igual o menor a {umbral}:{" "}
        <span className="font-medium">
          {insumos.map((i) => `${i.nombre} (${i.cantidad_disponible} ${i.unidad_medida})`).join(", ")}
        </span>
      </AlertDescription>
    </Alert>
  );
};

export default StockBajoAlert;
