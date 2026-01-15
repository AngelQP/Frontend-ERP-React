import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit2, Trash2, Cake, Package } from "lucide-react";
import { useState } from "react";
import { usePostres } from "@/hooks/usePostres";
import { type Postre, type PostreFormData } from "@/types";
import PostreDialog from "@/components/postres/PostreDialog";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";

const Postres = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPostre, setSelectedPostre] = useState<Postre | null>(null);

  const {
    postresConCosto,
    loadingState,
    insumos,
    crearPostre,
    editarPostre,
    eliminarPostre,
    calcularCostoReceta,
    obtenerInsumo,
  } = usePostres();

  const isLoading = loadingState === "loading";

  const filteredDesserts = postresConCosto.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setSelectedPostre(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (postre: Postre) => {
    setSelectedPostre(postre);
    setDialogOpen(true);
  };

  const handleOpenDelete = (postre: Postre) => {
    setSelectedPostre(postre);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (data: PostreFormData) => {
    if (selectedPostre) {
      await editarPostre(selectedPostre.id, data);
    } else {
      await crearPostre(data);
    }
  };

  const handleDelete = async () => {
    if (selectedPostre) {
      await eliminarPostre(selectedPostre.id);
    }
  };

  return (
    <AppLayout title="Postres" subtitle="Gestiona tu catálogo">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar postre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button className="gap-2" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Nuevo postre
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDesserts.map((dessert) => (
          <div
            key={dessert.id}
            className="card-elevated p-5 hover-lift animate-fade-in group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Cake className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleOpenEdit(dessert)}
                  disabled={isLoading}
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:text-destructive"
                  onClick={() => handleOpenDelete(dessert)}
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <h3 className="font-semibold text-foreground mb-1">{dessert.nombre}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {dessert.descripcion || "Sin descripción"}
            </p>

            {/* Recipe preview */}
            <div className="flex flex-wrap gap-1 mb-4">
              {dessert.receta.slice(0, 3).map((item) => {
                const insumo = obtenerInsumo(item.insumo_id);
                return (
                  <Badge key={item.insumo_id} variant="secondary" className="text-xs">
                    <Package className="w-3 h-3 mr-1" />
                    {insumo?.nombre || "?"}
                  </Badge>
                );
              })}
              {dessert.receta.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{dessert.receta.length - 3} más
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Precio</p>
                <p className="text-lg font-bold text-foreground">
                  ${dessert.precio_referencia}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Costo</p>
                <p className="text-sm font-medium text-muted-foreground">
                  ${dessert.costo_total.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Margen</p>
                <p
                  className={`text-sm font-medium ${
                    dessert.margen > 0 ? "text-success" : "text-destructive"
                  }`}
                >
                  {dessert.margen.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDesserts.length === 0 && (
        <div className="text-center py-12">
          <Cake className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm ? "No se encontraron resultados" : "No hay postres"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Intenta con otro término de búsqueda"
              : "Agrega tu primer postre para comenzar"}
          </p>
          {!searchTerm && (
            <Button className="gap-2" onClick={handleOpenCreate}>
              <Plus className="w-4 h-4" />
              Nuevo postre
            </Button>
          )}
        </div>
      )}

      {/* Dialogs */}
      <PostreDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        postre={selectedPostre}
        insumos={insumos}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        calcularCosto={calcularCostoReceta}
        obtenerInsumo={obtenerInsumo}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="¿Eliminar postre?"
        description={`Esta acción no se puede deshacer. Se eliminará "${selectedPostre?.nombre}" permanentemente.`}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </AppLayout>
  );
};

export default Postres;
