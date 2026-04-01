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
import { Plus, Search, Edit2, Trash2, Package, SendToBack } from "lucide-react";
import { useState } from "react";
import { useInsumos } from "@/hooks/useInsumos";
import { type InsumoFormData } from "@/features/insumos/types/insumos.type";
import InsumoDialog from "@/components/insumos/InsumoDialog";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";
import StockBajoAlert from "@/components/insumos/StockBajoAlert";
import type { Insumo } from "@/features/insumos/types/insumos.type";
import OperacionDialog from "@/components/insumos/OperacionDialog";

const Insumos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState<Insumo | null>(null);

  // Estado para el modal de movimeintos de insumos
  const [movementDialogOpen, setMovementDialogOpen] = useState(false);

  const {
    insumos,
    loadingState,
    insumosStockBajo,
    valorTotalInventario,
    crearInsumo,
    editarInsumo,
    eliminarInsumo,
    registrarMovimiento,
    STOCK_BAJO_UMBRAL,

    // 👇 unidades de medida
    unidadesMedida,
    loadingUnidades,

    // 👇 paginación
    meta,
    page,
    goToPage,
    // nextPage,
    // prevPage,
    fetchInsumos

  } = useInsumos();

  const isLoading = loadingState === "loading";

  // Handler para apertura de movimientos de insumos
  const handleOpenMovement = () => {
    setMovementDialogOpen(true);
  };

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
            S/. {valorTotalInventario.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total de insumos</p>
          <p className="text-2xl font-bold text-foreground">{meta?.total ?? 0}</p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar insumo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Botones de nuevo insumo y movimiento de insumo */}
        <div className="flex gap-2">

          <Button className="gap-2" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4" />
            Nuevo insumo
          </Button>

          <Button
            variant="outline"
            className="gap-2 border-primary text-primary"
            onClick={handleOpenMovement}
          >
            <SendToBack className="w-4 h-4" />
            Registrar Operación
          </Button>

        </div>

      </div>

      {/* <div className="flex flex-col"> */}

        {/* Table */}
        <div className="card-elevated overflow-hidden flex-1">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Insumo</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead className="text-right">Costo/Unidad</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                {/* <TableHead className="text-right">Valor total</TableHead> */}
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
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
                    {item.unidad_medida.toUpperCase()}
                  </TableCell>
                  <TableCell className="text-right">
                    S/. {item.costo_unitario.toFixed(2)}
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
                  {/* !TODO: Fila de valor total */}
                  {/* <TableCell className="text-right font-medium">
                    ${(item.costo_unitario * item.cantidad_disponible).toFixed(2)}
                  </TableCell> */}
                  <TableCell>
                    <div className="flex justify-end gap-3">
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

        {/* PAGINACIÓN */}
        {meta && meta.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-6 mt-auto">

              <Button
                variant="outline"
                disabled={!meta.hasPrevPage}
                onClick={ () => {
                  const prev = page - 1;
                  goToPage(prev);
                  fetchInsumos(prev);
                }}
              >
                Anterior
              </Button>

              <span className="text-sm text-muted-foreground">
                Página {page} de {meta.totalPages}
              </span>

              <Button
                variant="outline"
                disabled={!meta.hasNextPage}
                onClick={() => {
                  const next = page + 1;
                  goToPage(next);
                  fetchInsumos(next);
                }}
              >
                Siguiente
              </Button>

            </div>
        )}

      {/* </div> */}

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
        // Unidades de medida props
        unidadesMedida={unidadesMedida}
        loadingUnidades={loadingUnidades}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="¿Eliminar insumo?"
        description={`Esta acción no se puede deshacer. Se eliminará "${selectedInsumo?.nombre}" permanentemente.`}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />

      {/* Movimiento Dialog pendiente */}
      <OperacionDialog
        open={movementDialogOpen}
        onOpenChange={setMovementDialogOpen}
        onSubmit={async (data) => {
          await registrarMovimiento({
            insumo_id: data.insumoId,
            cantidad: data.cantidad,
            tipo: data.tipo,
            motivo: data.motivo,
            costoUnitario: data.costoUnitario,
          });
        }}
        isLoading={loadingState === "loading"}
        insumosOptions={insumos.map((i) => ({
          id: String(i.id),
          nombre: i.nombre,
        }))}
      />


    </AppLayout>
  );
};

export default Insumos;
