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
import { type Insumo, type InsumoFormData, UNIDADES_MEDIDA, type UnidadMedida } from "@/types";

const UNIDADES : UnidadMedida [] = ["kg", "g", "L", "ml", "pza"]; 

const insumoSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),

  unidad_medida: z
    .string()
    .nonempty("Selecciona una unidad")
    .refine((val) => UNIDADES.includes(val as any), {
      message: "Unidad inválida",
    }),    
  // unidad_medida: z.enum(UNIDADES, { 
  //   required_error: "Selecciona una unidad" 
  // }),

   cantidad_disponible: z.preprocess(
    (val) => (val === "" || val === null ? 0 : Number(val)),
    z
      .number({
        error: "Ingresa un número válido",
      })
      .min(0, "La cantidad no puede ser negativa")
  ),
  // cantidad_disponible: z.coerce
  //   .number({ invalid_type_error: "Ingresa un número válido" })
  //   .min(0, "La cantidad no puede ser negativa"),

  costo_unitario: z.preprocess(
    (val) => (val === "" || val === null ? 0 : Number(val)),
    z
      .number({
        error: "Ingresa un número válido",
      })
      .positive("El costo debe ser mayor a 0")
  ),
  // costo_unitario: z.coerce
  //   .number({ invalid_type_error: "Ingresa un número válido" })
  //   .positive("El costo debe ser mayor a 0"),
});

type InsumoFormValues = z.infer<typeof insumoSchema>;

interface InsumoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insumo?: Insumo | null;
  onSubmit: (data: InsumoFormData) => Promise<void>;
  isLoading?: boolean;
}

const InsumoDialog = ({
  open,
  onOpenChange,
  insumo,
  onSubmit,
  isLoading = false,
}: InsumoDialogProps) => {
  const isEditing = !!insumo;

  const form = useForm({
    resolver: zodResolver(insumoSchema),
    defaultValues: {
      nombre: "",
      unidad_medida: "kg",
      cantidad_disponible: 0,
      costo_unitario: 0,
    },
  });

  // Reset form when dialog opens with insumo data
  useEffect(() => {
    if (open) {
      if (insumo) {
        form.reset({
          nombre: insumo.nombre,
          unidad_medida: insumo.unidad_medida,
          cantidad_disponible: insumo.cantidad_disponible,
          costo_unitario: insumo.costo_unitario,
        });
      } else {
        form.reset({
          nombre: "",
          unidad_medida: "kg",
          cantidad_disponible: 0,
          costo_unitario: 0,
        });
      }
    }
  }, [open, insumo, form]);

  const handleSubmit = async (values: InsumoFormValues) => {
    try {
      await onSubmit(values as InsumoFormData);
      onOpenChange(false);
    } catch {
      // Error is handled by the hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar insumo" : "Nuevo insumo"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del insumo"
              : "Agrega un nuevo insumo a tu inventario"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del insumo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Harina de trigo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unidad_medida"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad de medida</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona unidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {UNIDADES_MEDIDA.map((unidad) => (
                        <SelectItem key={unidad.value} value={unidad.value}>
                          {unidad.label}
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
                name="cantidad_disponible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad disponible</FormLabel>
                    <FormControl>
                      {/* <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0"
                        {...field}
                      /> */}
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0"
                        value={field.value == null ? "" : String(field.value)}
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(v === "" ? undefined : Number(v));
                        }}
                      />

                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="costo_unitario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo por unidad ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        value={field.value == null ? "" : String(field.value)}
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(v === "" ? undefined : Number(v));
                        }}
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
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Guardar cambios" : "Crear insumo"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InsumoDialog;
