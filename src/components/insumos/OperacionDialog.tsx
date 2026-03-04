import { useEffect } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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

const TIPO_OPERACIONES = ["INGRESO", "SALIDA", "AJUSTE", "MERMA"] as const;

const operacionSchema = z
    .object({
        tipo: z.enum(TIPO_OPERACIONES),
        insumoId: z.string().min(1, "Selecciona un insumo"),
        cantidad: z.number().positive("Debe ser mayor a 0"),
        costoUnitario: z.number().positive().optional(),
        motivo: z.string().optional(),
    })
    .refine(
        (data) => data.tipo !== "INGRESO" || data.costoUnitario !== undefined,
        {
            message: "El costo unitario es obligatorio para un ingreso",
            path: ["costoUnitario"],
        }
    )
    .refine(
        (data) =>
            !["MERMA", "AJUSTE"].includes(data.tipo) || !!data.motivo?.trim(),
        {
            message: "El motivo es obligatorio para este tipo de operación",
            path: ["motivo"],
        }
    );

type OperacionFormValues = z.infer<typeof operacionSchema>;

interface OperacionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: OperacionFormValues) => Promise<void>;
  isLoading?: boolean;
  insumosOptions: { id: string; nombre: string }[];
}

const OperacionDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  insumosOptions,
}: OperacionDialogProps) => {
  const form = useForm<OperacionFormValues>({
    resolver: zodResolver(operacionSchema),
    defaultValues: {
      tipo: "INGRESO",
      insumoId: "",
      cantidad: undefined,
      motivo: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const handleSubmit = async (data: OperacionFormValues) => {
    await onSubmit(data);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Registrar operación</DialogTitle>
          <DialogDescription>
            Registra una operación de inventario.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Tipo */}
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de operación</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INGRESO">Ingreso</SelectItem>
                      <SelectItem value="SALIDA">Salida</SelectItem>
                      <SelectItem value="AJUSTE">Ajuste</SelectItem>
                      <SelectItem value="MERMA">Merma</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Insumo */}
            <FormField
              control={form.control}
              name="insumoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insumo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona insumo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {insumosOptions.map((i) => (
                        <SelectItem key={i.id} value={i.id}>
                          {i.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cantidad */}
            <FormField
              control={form.control}
              name="cantidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Costo Unitario */}
            {form.watch("tipo") === "INGRESO" && (
                <FormField
                    control={form.control}
                    name="costoUnitario"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Costo unitario</FormLabel>
                        <FormControl>
                        <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={field.value ?? ""}
                            onChange={(e) =>
                            field.onChange(
                                e.target.value === ""
                                ? undefined
                                : Number(e.target.value)
                            )
                            }
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            )}

            {/* Motivo */}
            <FormField
              control={form.control}
              name="motivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <FormControl>
                    <Input placeholder="Opcional / obligatorio para merma y ajuste" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                Registrar operación
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OperacionDialog;
