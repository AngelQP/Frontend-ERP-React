import { useEffect, useState } from "react";
import { Plus, Search, Filter } from "lucide-react";

import PreparacionDialog from "@/components/preparaciones/PreparacionDialog";

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

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";


import { usePostres } from "@/hooks/usePostres";
import { usePreparaciones } from "@/hooks/usePreparaciones";
import AppLayout from "@/components/AppLayout";
import type { CreatePreparacionRequest } from "@/features/preparaciones/types/preparacion.type";

const ESTADOS_DEFAULT = [
  "ACTIVA",
  "EN VENTA",
  "FINALIZADA",
];
const estadosFiltroDisponibles = [
  "ACTIVA",
  "EN VENTA",
  "FINALIZADA",
  "ANULADA",
];


export default function Preparaciones() {  

  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<string[]>(ESTADOS_DEFAULT);

  /** Aqui para manejar los estados de los filtros */
  const toggleEstado = (estado: string) => {
    setEstadoFiltro((prev) => {
      if (prev.includes(estado)) {
        if (prev.length === 1) return prev; // evitar quedar sin filtros
        return prev.filter((e) => e !== estado);
      }

      return [...prev, estado];
    });
  };

  const {
    preparaciones,
    createPreparacion,
    anularPreparacion,
    isLoading,
    meta,
    page,
    fetchPreparaciones,
    setPage
  } = usePreparaciones();

  const { postres } = usePostres();

  const handleCreate = async (data: CreatePreparacionRequest) => {
    await createPreparacion(data);
  };

  useEffect(() => {
    setPage(1);
    fetchPreparaciones(1, estadoFiltro);
  }, [estadoFiltro]);


  return (
    <AppLayout
        title="Preparaciones"
        subtitle="Gestión de producción de postres"
    >
      <div className="flex flex-col animate-fade-in h-full">



        {/* HEADER */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">

          {/* SEARCH + FILTER */}
          <div className="relative flex-1 flex items-center gap-2">

            <div className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <Input
                placeholder="Buscar postre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* FILTROS */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className={
                    estadoFiltro.length > 1
                      ? "text-primary"
                      : ""
                  }
                >
                  <Filter size={18} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Estado</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Estados  */}
                {estadosFiltroDisponibles.map((estado) => (
                  <DropdownMenuCheckboxItem 
                    key={estado}
                    checked={estadoFiltro.includes(estado)}
                    onCheckedChange={() => toggleEstado(estado)}
                  >
                    {estado.charAt(0) + estado.slice(1).toLowerCase()}
                  </DropdownMenuCheckboxItem>
                ))}

              </DropdownMenuContent>
            </DropdownMenu>

          </div>

          {/* BOTÓN CREAR */}
          <Button
            className="gap-2"
            onClick={() => setOpenDialog(true)}
          >
            <Plus size={18} />
            Nueva preparación
          </Button>

        </div>


        {/* GRID DE CARDS */}
        <div className="flex-1">
          {isLoading ? (
            <div className="text-muted-foreground">
              Cargando preparaciones...
            </div>
          ) : preparaciones.length === 0 ? (
            <div className="text-muted-foreground">
              No hay preparaciones
            </div>
          ) : (
              <div className="card-elevated overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Postre</TableHead>
                      <TableHead className="text-center">Planificadas</TableHead>
                      <TableHead className="text-center">Stock Real</TableHead>
                      <TableHead className="text-center">Disponible</TableHead>
                      <TableHead className="text-center">Precio</TableHead>
                      <TableHead className="text-center">Fecha</TableHead>
                      <TableHead className="text-center">Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {preparaciones.map((preparacion) => (
                      <TableRow
                        key={preparacion.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        {/* POSTRE */}
                        <TableCell className="font-medium">
                          {preparacion.nombrePostre}
                        </TableCell>

                        {/* STOCK REAL */}
                        <TableCell className="text-center">
                          {preparacion.porcionesReales + preparacion.merma}
                        </TableCell>

                        {/* PLANIFICADAS */}
                        <TableCell className="text-center">
                          {preparacion.porcionesPlanificadas}
                        </TableCell>

                        {/* STOCK ACTUAL */}
                        <TableCell className="text-center">
                          {preparacion.porcionesDisponibles}
                        </TableCell>

                        {/* PRECIO */}
                        <TableCell className="text-center">
                          S/. {preparacion.precioVentaReferencia}
                        </TableCell>

                         {/* FECHA */}
                        <TableCell className="text-muted-foreground text-center">
                          {new Date(preparacion.fechaPreparacion).toLocaleDateString(
                            "es-PE",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </TableCell>

                        {/* ESTADO */}
                        <TableCell className="text-center">
                          <span className="px-2 py-1 rounded-full text-xs bg-muted">
                            {preparacion.estado}
                          </span>
                        </TableCell>                     

                        {/* ACCIONES */}
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={preparacion.estado === "ANULADA"}
                            onClick={() => anularPreparacion(preparacion.id)}
                          >
                            Anular
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
          )}
        </div>

        {/* PAGINACIÓN */}

        {meta && meta.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">

            <Button
              variant="outline"
              disabled={!meta.hasPrevPage}
              onClick={ () => {
                const prev = page - 1;
                setPage(prev);
                fetchPreparaciones(prev, estadoFiltro);
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
                setPage(next);
                fetchPreparaciones(next, estadoFiltro);
              }}
            >
              Siguiente
            </Button>

          </div>
        )}

        {/* DIALOG */}
        <PreparacionDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          postres={postres}
          onSubmit={handleCreate}
          isLoading={isLoading}
        />
      </div>
    </AppLayout>
  );
}