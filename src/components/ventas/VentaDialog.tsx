import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, Check } from "lucide-react";
import { type Postre, type VentaFormData } from "@/types";

const ventaSchema = z.object({
  postre_id: z.string().min(1, "Selecciona un postre"),
  precio_venta: z
    .number({ error: "Ingresa un número válido" })
    .positive("El precio debe ser mayor a 0"),
  cantidad: z
    .number({ error: "Ingresa un número válido" })
    .int("Debe ser un número entero")
    .positive("La cantidad debe ser mayor a 0"),
});

type VentaFormValues = z.infer<typeof ventaSchema>;

interface ConsumoDetalle {
  insumo_id: string;
  nombre: string;
  unidad: string;
  cantidad: number;
  stock_actual: number;
  suficiente: boolean;
}

interface ResumenVenta {
  postre_nombre: string;
  precio_referencia: number;
  precio_venta: number;
  cantidad: number;
  total: number;
  costo_total: number;
  consumos: ConsumoDetalle[];
  stock_suficiente: boolean;
  insumos_faltantes: string[];
}

interface VentaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postres: Postre[];
  onSubmit: (data: VentaFormData) => Promise<unknown>;
  prepararResumen: (data: VentaFormData) => ResumenVenta | null;
  isLoading?: boolean;
}

const VentaDialog = ({
  open,
  onOpenChange,
  postres,
  onSubmit,
  prepararResumen,
  isLoading = false,
}: VentaDialogProps) => {
  const [resumen, setResumen] = useState<ResumenVenta | null>(null);
  const [step, setStep] = useState<"form" | "confirm">("form");

  const form = useForm<VentaFormValues>({
    resolver: zodResolver(ventaSchema),
    defaultValues: {
      postre_id: "",
      precio_venta: 0,
      cantidad: 1,
    },
  });

  const watchPostreId = form.watch("postre_id");
  const selectedPostre = useMemo(() => 
    postres.find(p => p.id === watchPostreId),
    [postres, watchPostreId]
  );

  // Set reference price when postre changes
  useEffect(() => {
    if (selectedPostre) {
      form.setValue("precio_venta", selectedPostre.precio_referencia);
    }
  }, [selectedPostre, form]);

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        postre_id: "",
        precio_venta: 0,
        cantidad: 1,
      });
      setResumen(null);
      setStep("form");
    }
  }, [open, form]);

  const handlePreview = (values: VentaFormValues) => {
    const res = prepararResumen(values as VentaFormData);
    setResumen(res);
    setStep("confirm");
  };

  const handleConfirm = async () => {
    const values = form.getValues();
    try {
      await onSubmit(values as VentaFormData);
      onOpenChange(false);
    } catch {
      // Error handled by hook
    }
  };

  const handleBack = () => {
    setStep("form");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {step === "form" ? "Nueva venta" : "Confirmar venta"}
          </DialogTitle>
          <DialogDescription>
            {step === "form"
              ? "Selecciona un postre y configura la venta"
              : "Revisa los detalles antes de confirmar"}
          </DialogDescription>
        </DialogHeader>

        {step === "form" ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePreview)} className="space-y-4">
              <FormField
                control={form.control}
                name="postre_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postre</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un postre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {postres.map((postre) => (
                          <SelectItem key={postre.id} value={postre.id}>
                            {postre.nombre} - ${postre.precio_referencia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="precio_venta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio de venta ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cantidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Revisar venta
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : resumen ? (
          <div className="space-y-4">
            {/* Stock warning */}
            {!resumen.stock_suficiente && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Stock insuficiente: {resumen.insumos_faltantes.join(", ")}
                </AlertDescription>
              </Alert>
            )}

            {/* Sale summary */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{resumen.postre_nombre}</span>
                <span>x{resumen.cantidad}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Precio unitario:</span>
                <span>${resumen.precio_venta.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span className="text-success">${resumen.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Consumos */}
            <div>
              <p className="text-sm font-medium mb-2">Insumos a descontar:</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {resumen.consumos.map((c) => (
                  <div
                    key={c.insumo_id}
                    className={`flex items-center justify-between text-sm p-2 rounded ${
                      c.suficiente ? "bg-success/10" : "bg-destructive/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {c.suficiente ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                      )}
                      <span>{c.nombre}</span>
                    </div>
                    <span>
                      {c.cantidad.toFixed(2)} {c.unidad}
                      <span className="text-muted-foreground ml-1">
                        (hay {c.stock_actual})
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleBack}>
                Volver
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isLoading || !resumen.stock_suficiente}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar venta
              </Button>
            </DialogFooter>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default VentaDialog;
