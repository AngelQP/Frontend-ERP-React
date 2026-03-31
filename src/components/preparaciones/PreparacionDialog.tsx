import { useEffect, useMemo } from "react";
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

import { Loader2 } from "lucide-react";
import type { Postre } from "@/features/postres/types/postre.types";

const preparacionSchema = z.object({
  postre_id: z.string().min(1, "Selecciona un postre"),
  porcionesPlanificadas: z
    .number({ error: "Ingresa un número válido" })
    .int("Debe ser entero")
    .positive("Debe ser mayor a 0"),

  porcionesReales: z
    .number({ error: "Ingresa un número válido" })
    .int("Debe ser entero")
    .positive("Debe ser mayor a 0"),
});

type PreparacionFormValues = z.infer<typeof preparacionSchema>;

interface PreparacionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postres: Postre[];
  onSubmit: (data: PreparacionFormValues) => Promise<void>;
  isLoading?: boolean;
}

const PreparacionDialog = ({
  open,
  onOpenChange,
  postres,
  onSubmit,
  isLoading = false,
}: PreparacionDialogProps) => {
  const form = useForm<PreparacionFormValues>({
    resolver: zodResolver(preparacionSchema),
    defaultValues: {
      postre_id: "",
      porcionesPlanificadas: 1,
      porcionesReales: 1,
    },
  });

  const watchPostreId = form.watch("postre_id");
  const watchPlanificadas = form.watch("porcionesPlanificadas");

  const postreSeleccionado = useMemo(
    () => postres.find((p) => p.id === watchPostreId),
    [watchPostreId, postres]
  );

  // Autocompletar porciones planificadas con rendimiento base
  useEffect(() => {
    if (postreSeleccionado) {
      form.setValue("porcionesPlanificadas", postreSeleccionado.rendimiento_base);
      form.setValue("porcionesReales", postreSeleccionado.rendimiento_base);
    }
  }, [postreSeleccionado, form]);

  const factorProduccion = useMemo(() => {
    if (!postreSeleccionado) return 1;
    return watchPlanificadas / postreSeleccionado.rendimiento_base;
  }, [watchPlanificadas, postreSeleccionado]);

  const handleSubmit = async (values: PreparacionFormValues) => {
    try {
      await onSubmit(values);
      form.reset()
      onOpenChange(false);
    } catch {
      // manejado por hook
    }
  };

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Nueva preparación</DialogTitle>
          <DialogDescription>
            Registra la producción de un postre
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
            noValidate
          >
            {/* Postre */}
            <FormField
              control={form.control}
              name="postre_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postre</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un postre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {postres.map((postre) => (
                        <SelectItem key={postre.id} value={postre.id}>
                          {postre.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Porciones planificadas */}
            <FormField
              control={form.control}
              name="porcionesPlanificadas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Porciones planificadas</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (value === "") {
                          field.onChange(undefined);
                        } else {
                          field.onChange(Number(value));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Porciones reales */}
            <FormField
              control={form.control}
              name="porcionesReales"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Porciones reales</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (value === "") {
                          field.onChange(undefined);
                        } else {
                          field.onChange(Number(value));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Info producción */}
            {postreSeleccionado && (
              <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Rendimiento base:
                  </span>
                  <span className="font-medium">
                    {postreSeleccionado.rendimiento_base} porciones
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Factor producción:
                  </span>
                  <span className="font-bold">
                    {factorProduccion.toFixed(2)}x
                  </span>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Crear preparación
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PreparacionDialog;