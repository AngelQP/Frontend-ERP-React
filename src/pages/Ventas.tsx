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
import { Plus, Search, ShoppingCart, Calendar, TrendingUp } from "lucide-react";
import { useState } from "react";
import StatCard from "@/components/StatCard";
import { useVentas } from "@/hooks/useVentas";
import VentaDialog from "@/components/ventas/VentaDialog";

const Ventas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    ventasConDetalle,
    loadingState,
    postres,
    ventasHoy,
    registrarVenta,
    prepararResumenVenta,
  } = useVentas();

  const isLoading = loadingState === "loading";

  const filteredSales = ventasConDetalle.filter((sale) =>
    sale.postre_nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalHoy = ventasHoy.reduce((acc, v) => acc + v.precio_venta * v.cantidad, 0);
  const totalMes = ventasConDetalle.reduce((acc, v) => acc + v.precio_venta * v.cantidad, 0);

  return (
    <AppLayout title="Ventas" subtitle="Registra y consulta ventas">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Ventas de hoy"
          value={`$${totalHoy.toLocaleString()}`}
          icon={ShoppingCart}
          variant="primary"
        />
        <StatCard
          title="Total del mes"
          value={`$${totalMes.toLocaleString()}`}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Transacciones"
          value={ventasConDetalle.length.toString()}
          icon={Calendar}
          variant="secondary"
        />
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar venta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Nueva venta
        </Button>
      </div>

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Producto</TableHead>
              <TableHead className="text-center">Cantidad</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary-light flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-secondary" />
                    </div>
                    <span className="font-medium">{sale.postre_nombre}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted">
                    x{sale.cantidad}
                  </span>
                </TableCell>
                <TableCell className="text-right font-semibold text-success">
                  ${(sale.precio_venta * sale.cantidad).toFixed(2)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {new Date(sale.fecha).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "short",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
        postres={postres}
        onSubmit={registrarVenta}
        prepararResumen={prepararResumenVenta}
        isLoading={isLoading}
      />
    </AppLayout>
  );
};

export default Ventas;
