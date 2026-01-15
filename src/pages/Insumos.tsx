import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit2, Trash2, Package } from "lucide-react";
import { useState } from "react";
import { useInsumos } from "@/hooks/useInsumos";
import { type Insumo, type InsumoFormData } from "@/types";
import InsumoDialog from "@/components/insumos/InsumoDialog";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";
import StockBajoAlert from "@/components/insumos/StockBajoAlert";

const Insumos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState<Insumo | null>(null);

  const {
    insumos,
    loadingState,
    insumosStockBajo,
    valorTotalInventario,
    crearInsumo,
    editarInsumo,
    eliminarInsumo,
    STOCK_BAJO_UMBRAL,
  } = useInsumos();

  const isLoading = loadingState === "loading";

  const filteredIngredients = insumos.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setSelectedInsumo(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (insumo: Insumo) => {
    setSelectedInsumo(insumo);
    setDialogOpen(true);
  };

  const handleOpenDelete = (insumo: Insumo) => {
    setSelectedInsumo(insumo);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (data: InsumoFormData) => {
    if (selectedInsumo) {
      await editarInsumo(selectedInsumo.id, data);
    } else {
      await crearInsumo(data);
    }
  };

  const handleDelete = async () => {
    if (selectedInsumo) {
      await eliminarInsumo(selectedInsumo.id);
    }
  };

  return (
    <AppLayout title="Insumos" subtitle="Gestiona tus ingredientes">
      {/* Stock bajo alert */}
      <StockBajoAlert insumos={insumosStockBajo} umbral={STOCK_BAJO_UMBRAL} />

      {/* Summary Card */}
      <div className="card-elevated p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Valor total del inventario</p>
          <p className="text-2xl font-bold text-foreground">
            ${valorTotalInventario.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total de insumos</p>
          <p className="text-2xl font-bold text-foreground">{insumos.length}</p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar insumo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button className="gap-2" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Nuevo insumo
        </Button>
      </div>

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Insumo</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead className="text-right">Costo/Unidad</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Valor total</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIngredients.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{item.nombre}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.unidad_medida}
                </TableCell>
                <TableCell className="text-right">
                  ${item.costo_unitario.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.cantidad_disponible <= STOCK_BAJO_UMBRAL
                        ? "bg-warning-light text-warning"
                        : "bg-success-light text-success"
                    }`}
                  >
                    {item.cantidad_disponible} {item.unidad_medida}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${(item.costo_unitario * item.cantidad_disponible).toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenEdit(item)}
                      disabled={isLoading}
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-destructive"
                      onClick={() => handleOpenDelete(item)}
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {filteredIngredients.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm ? "No se encontraron resultados" : "No hay insumos"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Intenta con otro término de búsqueda"
              : "Agrega tu primer insumo para comenzar"}
          </p>
          {!searchTerm && (
            <Button className="gap-2" onClick={handleOpenCreate}>
              <Plus className="w-4 h-4" />
              Nuevo insumo
            </Button>
          )}
        </div>
      )}

      {/* Dialogs */}
      <InsumoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        insumo={selectedInsumo}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="¿Eliminar insumo?"
        description={`Esta acción no se puede deshacer. Se eliminará "${selectedInsumo?.nombre}" permanentemente.`}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </AppLayout>
  );
};

export default Insumos;
