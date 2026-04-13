import { useEffect, useMemo } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, Package } from "lucide-react";
import type { Postre, PostreFormData } from "@/features/postres/types/postre.types";
import type { Insumo } from "@/features/insumos/types/insumos.type";

const recetaItemSchema = z.object({
  insumo_id: z.string().min(1, "Selecciona un insumo"),
  cantidad: z
    .number({ error: "Ingresa un número" })
    .positive("Debe ser mayor a 0"),
});

const postreSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  descripcion: z.string().max(255, "Máximo 255 caracteres").optional(),
  precio_referencia: z
    .number({ error: "Ingresa un número válido" })
    .positive("El precio debe ser mayor a 0"),
  rendimiento_base: z
    .number({ error: "Ingresa un número válido" })
    .int("Debe ser un número entero")
    .positive("Debe ser mayor a 0"),
  receta: z.array(recetaItemSchema).min(1, "Agrega al menos un insumo a la receta"),
}).refine((data) => {
  // Check for duplicate insumos
  const ids = data.receta.map(r => r.insumo_id);
  return new Set(ids).size === ids.length;
}, {
  message: "No puedes agregar el mismo insumo dos veces",
  path: ["receta"],
});

type PostreFormValues = z.infer<typeof postreSchema>;

interface PostreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postre?: Postre | null;
  insumos: Insumo[];
  onSubmit: (data: PostreFormData) => Promise<void>;
  isLoading?: boolean;
  calcularCosto: (receta: { insumo_id: string; cantidad: number }[]) => number;
  obtenerInsumo: (id: string) => Insumo | undefined;
}

const PostreDialog = ({
  open,
  onOpenChange,
  postre,
  insumos,
  onSubmit,
  isLoading = false,
  calcularCosto,
  obtenerInsumo,
}: PostreDialogProps) => {
  const isEditing = !!postre;

  const form = useForm<PostreFormValues>({
    resolver: zodResolver(postreSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      precio_referencia: 0,
      rendimiento_base: 1,
      receta: [],
    },
  });

  const { fields, append, remove } = useFieldArray<PostreFormValues, "receta">({
    control: form.control,
    name: "receta",
  });

  const watchReceta = useWatch({
    control: form.control,
    name: "receta",
  });

  const watchPrecio = useWatch({
    control: form.control,
    name: "precio_referencia",
  });

  const watchRendimiento = useWatch({
    control: form.control,
    name: "rendimiento_base",
  });

  // Recalcular costo cuando cambia la receta o el precio o rendimiento
  const costoCalculado = useMemo(() => {

    if (!watchReceta || watchReceta.length === 0) return 0;

    const validReceta = watchReceta.filter(
      (r): r is { insumo_id: string; cantidad: number } =>
        !!r?.insumo_id && Number(r?.cantidad) > 0
    );

    return calcularCosto(validReceta);

  }, [watchReceta, calcularCosto]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (postre) {
        form.reset({
          nombre: postre.nombre,
          descripcion: postre.descripcion || "",
          precio_referencia: postre.precio_referencia,
          rendimiento_base: postre.rendimiento_base,
          receta: postre.receta,
        });
      } else {
        form.reset({
          nombre: "",
          descripcion: "",
          precio_referencia: 0,
          rendimiento_base: 1,
          receta: [],
        });
      }
    }
  }, [open, postre, form]);

  const handleSubmit = async (values: PostreFormValues) => {
    try {
      await onSubmit(values as PostreFormData);
      onOpenChange(false);
    } catch {
      // Error handled by hook
    }
  };

  const handleAddInsumo = () => {
    append({ insumo_id: "", cantidad: 0 });
  };

  // Insumos disponibles (no usados aún en la receta)
  const getAvailableInsumos = (currentIndex: number) => {
    const usedIds = watchReceta
      ?.filter((_, i) => i !== currentIndex)
      .map(r => r.insumo_id) || [];
    return insumos.filter(i => !usedIds.includes(i.id));
  };

  const costoUnitario =
    watchRendimiento > 0
      ? costoCalculado / watchRendimiento
      : 0;

  const margen =
    watchPrecio > 0
      ? ((watchPrecio - costoUnitario) / watchPrecio) * 100
      : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar postre" : "Nuevo postre"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del postre y su receta"
              : "Crea un nuevo postre con su receta de ingredientes"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
            {/* Basic Info */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del postre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Pastel de Chocolate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Breve descripción del postre"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="precio_referencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio de venta por unidad (S/.)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rendimiento_base"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Porciones</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        min="1"
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            {/* Recipe Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Receta</h4>
                  <p className="text-xs text-muted-foreground">
                    Agrega los insumos necesarios para este postre
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddInsumo}
                  disabled={fields.length >= insumos.length}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar insumo
                </Button>
              </div>

              {form.formState.errors.receta?.message && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.receta.message}
                </p>
              )}

              {fields.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No hay insumos en la receta
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAddInsumo}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar primer insumo
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((field, index) => {
                    const selectedInsumo = obtenerInsumo(watchReceta?.[index]?.insumo_id || "");
                    return (
                      <div
                        key={field.id}
                        className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`receta.${index}.insumo_id`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Insumo</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecciona" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {getAvailableInsumos(index).map((insumo) => (
                                      <SelectItem key={insumo.id} value={insumo.id}>
                                        {insumo.nombre} ({insumo.unidad_medida})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`receta.${index}.cantidad`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">
                                  Cantidad {selectedInsumo ? `(${selectedInsumo.unidad_medida})` : ""}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0"
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 mt-6 hover:text-destructive"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cost Summary */}
            {fields.length > 0 && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Costo del lote:</span>
                  <span className="font-medium">S/. {costoCalculado.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Porciones:</span>
                  <span className="font-medium">{watchRendimiento}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Costo por unidad:</span>
                  <span className="font-medium">
                    S/. {costoUnitario.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Precio de venta:</span>
                  <span className="font-medium">
                    S/. {Number(watchPrecio || 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-muted-foreground">Margen de ganancia:</span>
                  <span
                    className={`font-bold ${
                      margen > 0 ? "text-success" : "text-destructive"
                    }`}
                  >
                    {margen.toFixed(1)}%
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
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Guardar cambios" : "Crear postre"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PostreDialog;
