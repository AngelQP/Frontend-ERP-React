import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Plus, Search, ShoppingCart, Calendar, TrendingUp, Filter } from "lucide-react";
import { useState } from "react";
import StatCard from "@/components/StatCard";
import { useVentas } from "@/hooks/useVentas";
import VentaDialog from "@/components/ventas/VentaDialog";
import type { VentaEstado } from "@/features/ventas/types/venta.types";
// import { anularVenta } from '../api/ventas.api';

const Ventas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    ventas,
    loadingVentas,
    preparaciones,
    registrarVenta,
    eliminarVenta,
    estadosVentas,
    setEstadosVentas,
    setVentasPage,
    ventasMeta,
    ventasPage
  } = useVentas();

  console.log("ventas:", ventas);

  /** Toogle de estados de filtro de busqueda */
  const toggleEstado = (estado: VentaEstado) => {

    setEstadosVentas((prev) => {

      if (prev.includes(estado)) {

        if (prev.length === 1) return prev;

        return prev.filter((e) => e !== estado);
      }

      return [...prev, estado];

    });

    setVentasPage(1);
  };

  const ventasHoy = ventas.filter((v) => {

    const hoy = new Date();

    const fechaVenta = new Date(v.fechaVenta);

    return (
      fechaVenta.getDate() === hoy.getDate() &&
      fechaVenta.getMonth() === hoy.getMonth() &&
      fechaVenta.getFullYear() === hoy.getFullYear()
    );

  });

  /** Para ver si puede anular dentro de las 24 horas */
  const puedeAnular = (fechaVenta: string) => {

    const fecha = new Date(fechaVenta);
    const ahora = new Date();

    const diff = ahora.getTime() - fecha.getTime();

    const horas = diff / (1000 * 60 * 60);

    return horas <= 24;
  };

  const isLoading = loadingVentas;

  const filteredSales = ventas.filter((sale) =>
    sale.nombrePostre
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  /* ============================
    TOTALES
  ============================ */

  const totalHoy = ventasHoy.reduce(
    (acc, v) => acc + Number(v.total),
    0
  );

  const totalMes = ventas.reduce(
    (acc, v) => acc + Number(v.total),
    0
  );

  return (
    <AppLayout title="Ventas" subtitle="Registra y consulta ventas">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Ventas de hoy"
          value={`S/. ${totalHoy.toLocaleString()}`}
          icon={ShoppingCart}
          variant="primary"
        />
        <StatCard
          title="Total del mes"
          value={`S/. ${totalMes.toLocaleString()}`}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Transacciones"
          value={ventas.length.toString()}
          icon={Calendar}
          variant="secondary"
        />
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">

        {/* Search + Filter */}

        <div className="relative flex-1 flex items-center gap-2">

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar venta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

           {/* FILTRO */}
          <DropdownMenu>

            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={
                  estadosVentas.length > 1
                    ? "text-primary"
                    : ""
                }
              >
                <Filter className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">

              <DropdownMenuLabel>
                Estado de venta
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuCheckboxItem
                checked={estadosVentas.includes("PAGADA")}
                onCheckedChange={() => toggleEstado("PAGADA" as VentaEstado)}
              >
                Pagadas
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={estadosVentas.includes("ANULADA")}
                onCheckedChange={() => toggleEstado("ANULADA" as VentaEstado)}
              >
                Anuladas
              </DropdownMenuCheckboxItem>

            </DropdownMenuContent>

          </DropdownMenu>
        
        </div>

        {/* BOTÓN DE NUEVA VENTA */}
        <Button className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Nueva venta
        </Button>
      </div>
      
      <div className="flex flex-col">            
        {/* Table */}
        <div className="card-elevated overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Producto</TableHead>
                <TableHead className="text-center">Cantidad</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-right">Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow
                  key={sale.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary-light flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-secondary" />
                      </div>

                      <span className="font-medium">
                        {sale.nombrePostre}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted">
                      x{sale.cantidad}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    S/. {Number(sale.precioUnitario).toFixed(2)}
                  </TableCell>

                  <TableCell className="text-right font-semibold text-success">
                    S/. {Number(sale.total).toFixed(2)}
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="px-2 py-1 rounded-full text-xs bg-muted">
                      {sale.estado}
                    </span>
                  </TableCell>

                  <TableCell className="text-right text-muted-foreground">
                    {new Date(sale.fechaVenta).toLocaleDateString("es-PE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>

                  <TableCell className="text-right">

                    <AlertDialog>

                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={
                            sale.estado === "ANULADA" ||
                            !puedeAnular(sale.fechaVenta)
                          }
                        >
                          Anular
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>

                        <AlertDialogHeader>

                          <AlertDialogTitle>
                            ¿Deseas anular esta venta?
                          </AlertDialogTitle>

                          <AlertDialogDescription>
                            Esta acción anulará la venta y repondrá el stock automáticamente.
                            No se podrá revertir.
                          </AlertDialogDescription>

                        </AlertDialogHeader>

                        <AlertDialogFooter>

                          <AlertDialogCancel>
                            Cancelar
                          </AlertDialogCancel>

                          <AlertDialogAction
                            onClick={() => eliminarVenta(sale.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Sí, anular
                          </AlertDialogAction>

                        </AlertDialogFooter>

                      </AlertDialogContent>

                    </AlertDialog>

                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* PAGINACIÓN */}
        {ventasMeta && ventasMeta.totalPages > 1 && (

          <div className="mt-10 pt-6 flex justify-center items-center gap-4">

            <Button
              variant="outline"
              disabled={!ventasMeta.hasPrevPage}
              onClick={() => setVentasPage((prev) => prev-1)}
            >
              Anterior
            </Button>

            <span className="text-sm text-muted-foreground">
              Página {ventasPage} de {ventasMeta.totalPages}
            </span>

            <Button
              variant="outline"
              disabled={!ventasMeta.hasNextPage}
              onClick={() => setVentasPage((prev) => prev+1)}
            >
              Siguiente
            </Button>

          </div>

        )}
      </div>

      {/* Empty State */}
      {filteredSales.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm ? "No se encontraron resultados" : "No hay ventas"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Intenta con otro término"
              : "Registra tu primera venta para comenzar"}
          </p>
          {!searchTerm && (
            <Button className="gap-2" onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4" />
              Nueva venta
            </Button>
          )}
        </div>
      )}

      {/* Dialog */}
      <VentaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        preparaciones={preparaciones}
        onSubmit={registrarVenta}
        // prepararResumen={null}
        isLoading={isLoading}
      />
    </AppLayout>
  );
};

export default Ventas;
