import { useState } from "react";
import { Plus, Search } from "lucide-react";

import PreparacionCard from "@/components/preparaciones/PreparacionCard";
import PreparacionDialog from "@/components/preparaciones/PreparacionDialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { usePostres } from "@/hooks/usePostres";
import { usePreparaciones } from "@/hooks/usePreparaciones";
import AppLayout from "@/components/AppLayout";

export default function Preparaciones() {
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState("");

  const {
    preparaciones,
    createPreparacion,
    anularPreparacion,
    isLoading,
  } = usePreparaciones();

  const { postres } = usePostres();

  const preparacionesFiltradas = preparaciones.filter((p) =>
    p.nombrePostre.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (data: any) => {
    await createPreparacion(data);
  };

  const handleAnular = async (id: string) => {
    const confirm = window.confirm(
      "¿Seguro que deseas anular esta preparación?"
    );

    if (!confirm) return;

    await anularPreparacion(id);
  };

  return (
    <AppLayout
        title="Preparaciones"
        subtitle="Gestión de producción de postres"
    >
      <div className="space-y-6 animate-fade-in">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          
            {/* BUSCADOR */}
            <div className="relative max-w-sm">
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

            {/* Buton de creacion  */}
            <Button
                onClick={() => setOpenDialog(true)}
                className="gap-2"
            >
                <Plus size={18} />
                Nueva preparación
            </Button>


        </div>


        {/* GRID DE CARDS */}
        {isLoading ? (
          <div className="text-muted-foreground">
            Cargando preparaciones...
          </div>
        ) : preparacionesFiltradas.length === 0 ? (
          <div className="text-muted-foreground">
            No hay preparaciones registradas
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {preparacionesFiltradas.map((preparacion) => (
              <PreparacionCard
                key={preparacion.id}
                preparacion={preparacion}
                onAnular={handleAnular}
              />
            ))}
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