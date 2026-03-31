import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
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
import { Loader2 } from "lucide-react";

import { type Preparacion } from "@/features/preparaciones/types/preparacion.type";
import { type VentaFormData } from "@/features/ventas/types/venta.types";

const ventaSchema = z.object({
  preparacion_id: z.string().min(1, "Selecciona un postre"),
  precioUnitario: z.coerce
    .number({ error: "Ingresa un número válido" })
    .positive("El precio debe ser mayor a 0"),
  cantidad: z.coerce
    .number({ error: "Ingresa un número válido" })
    .int("Debe ser un número entero")
    .positive("La cantidad debe ser mayor a 0"),
});

type VentaFormValues = z.infer<typeof ventaSchema>;


interface VentaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preparaciones: Preparacion[];
  onSubmit: (data: VentaFormData) => Promise<unknown>;
  isLoading?: boolean;
}

const VentaDialog = ({
  open,
  onOpenChange,
  preparaciones,
  onSubmit,
  isLoading = false,
}: VentaDialogProps) => {

  const form = useForm<VentaFormValues>({
    // resolver: zodResolver(ventaSchema),
    defaultValues: {
      preparacion_id: "",
      precioUnitario: 0,
      cantidad: 1,
    },
  });

  const watchPreparacionId = form.watch("preparacion_id");

  const selectedPreparacion = useMemo(
    () => preparaciones.find(p => p.id === watchPreparacionId),
    [preparaciones, watchPreparacionId]
  );

  // Set reference price when postre changes
  useEffect(() => {
    if (selectedPreparacion) {
      form.setValue("precioUnitario", selectedPreparacion.precioVentaReferencia);
    }
  }, [selectedPreparacion, form]);

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        preparacion_id: "",
        precioUnitario: 0,
        cantidad: 1,
      });
    }
  }, [open, form]);

  const handleConfirm = async (values: VentaFormValues) => {
    try {
      await onSubmit({
        ...values,
        cantidad: Number(values.cantidad),
        precioUnitario: Number(values.precioUnitario),
      });
      onOpenChange(false);
    } catch {
      // Error handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nueva Venta</DialogTitle>
          <DialogDescription>
            Selecciona una preparación y realiza la venta
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleConfirm)} className="space-y-4">
            <FormField
              control={form.control}
              name="preparacion_id"
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
                      {preparaciones.map((prepa) => (
                        <SelectItem key={prepa.id} value={prepa.id}>
                          {prepa.nombrePostre} - S/. {prepa.precioVentaReferencia}
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
                name="precioUnitario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio de venta (S/. )</FormLabel>
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
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Registrar venta
              </Button>
            </DialogFooter>
          </form>
        </Form>
        
      </DialogContent>
    </Dialog>
  );
};

export default VentaDialog;
