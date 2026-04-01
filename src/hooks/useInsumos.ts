import { useState, useCallback, useMemo, useEffect } from 'react';
import { type LoadingState, type ApiError } from '@/types';
import { toast } from 'sonner';

import { eliminarInsumoApi, getUnidadesMedida } from '@/api/insumos.api';
import type { UnidadMedida } from '@/features/insumos/types/unidad-medida.types';
import type { Insumo, InsumoFormData } from '@/features/insumos/types/insumos.type';

import { createInsumoApi, listarInsumosConStock } from '@/api/insumos.api';

import { crearMovimientoApi, type MovimientoPayload } from '@/api/movimiento.api';

const STOCK_BAJO_UMBRAL = 5;

export const useInsumos = () => {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);

  // Para manejo de unidades de medida
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [loadingUnidades, setLoadingUnidades] = useState(false);
  const [errorUnidades, setErrorUnidades] = useState<string | null>(null);

  // Manejo de paginacion
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchInsumos = useCallback(async (page=1, limit=4) => {
    setLoadingState("loading");
    setError(null);

    try {
      const response = await listarInsumosConStock(page, limit);
      setInsumos(response.data);
      setMeta(response.meta);
      setLoadingState("success");
    } catch (err) {
      setError({ code: "FETCH_ERROR", message: "Error al cargar insumos" });
      setLoadingState("error");
      toast.error("Error al cargar insumos");
    }
  }, []);

  const nextPage = () => {
    if (meta.hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (meta.hasPrevPage) {
      setPage(prev => prev - 1);
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    fetchInsumos();

    const fetchUnidadesMedida = async () => {
      try {
        setLoadingUnidades(true);
        const data = await getUnidadesMedida();
        setUnidadesMedida(data);
      } catch (err) {
        console.error('Error cargando unidades de medida', err);
        setErrorUnidades('No se pudieron cargar las unidades de medida');
        toast.error('Error al cargar unidades de medida');
      } finally {
        setLoadingUnidades(false);
      }
    };

    fetchUnidadesMedida();
  }, [fetchInsumos]);

  // Insumos con stock bajo
  const insumosStockBajo = useMemo(() => 
    insumos.filter(i => i.cantidad_disponible <= STOCK_BAJO_UMBRAL),
    [insumos]
  );

  // Valor total del inventario
  const valorTotalInventario = useMemo(() =>
    insumos.reduce((acc, i) => acc + (i.cantidad_disponible * i.costo_unitario), 0),
    [insumos]
  );

  // Simula delay de API
  const simulateApi = () => new Promise(resolve => setTimeout(resolve, 300));

  // Crear insumo
  const crearInsumo = useCallback(async (data: InsumoFormData) => {
    setLoadingState('loading');
    setError(null);
    
    try {

      await createInsumoApi(data);

      // Agregamos a la lista solo después de que el servidor confirma
      await fetchInsumos();

      setLoadingState('success');
      toast.success('Insumo creado correctamente');

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      setLoadingState('error');
      toast.error(apiError.message || 'Error al crear insumo');
      throw err;
    }
  }, []);

  // Editar insumo
  const editarInsumo = useCallback(async (id: string, data: Partial<InsumoFormData>) => {
    setLoadingState('loading');
    setError(null);
    
    try {
      await simulateApi();

      setInsumos(prev => prev.map(i => 
        i.id === id ? { ...i, ...data } : i
      ));
      
      setLoadingState('success');
      toast.success('Insumo actualizado correctamente');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      setLoadingState('error');
      toast.error(apiError.message || 'Error al actualizar insumo');
      throw err;
    }
  }, []);

  // Eliminar insumo
  const eliminarInsumo = useCallback(async (id: string) => {
    setLoadingState('loading');
    setError(null);
    
    try {
      // await simulateApi();
      await eliminarInsumoApi(id);
      await fetchInsumos();
      setLoadingState('success');
      toast.success('Insumo eliminado correctamente');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      setLoadingState('error');
      toast.error(apiError.message || 'Error al eliminar insumo');
      throw err;
    }
  }, []);

  // Registrar movimiento de insumo (ingreso/salida/ajuste/merma)
  const registrarMovimiento = useCallback(
    async (payload: MovimientoPayload) => {
      setLoadingState("loading");
      setError(null);

      try {
        const updated = await crearMovimientoApi(payload);

        // Volvemos a consultar inventario actualizado
        // await fetchInsumos();

        setInsumos(prev =>
          prev.map(insumo =>
            insumo.id === updated.insumo_id
              ? {
                  ...insumo,
                  cantidad_disponible: updated.stock_actual,
                  costo_unitario: updated.costo_promedio
                }
              : insumo
          )
        );

        setLoadingState("success");
        toast.success("Operación registrada correctamente");
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        setLoadingState("error");
        toast.error(apiError.message || "Error al registrar operación");
        throw err;
      }
    },
    []
  );


  // Descontar stock (usado por ventas)
  const descontarStock = useCallback((consumos: { insumo_id: string; cantidad: number }[]) => {
    setInsumos(prev => prev.map(insumo => {
      const consumo = consumos.find(c => c.insumo_id === insumo.id);
      if (consumo) {
        return {
          ...insumo,
          cantidad_disponible: Math.max(0, insumo.cantidad_disponible - consumo.cantidad)
        };
      }
      return insumo;
    }));
  }, []);

  // Verificar stock suficiente
  const verificarStock = useCallback((consumos: { insumo_id: string; cantidad: number }[]): { valido: boolean; faltantes: string[] } => {
    const faltantes: string[] = [];
    
    for (const consumo of consumos) {
      const insumo = insumos.find(i => i.id === consumo.insumo_id);
      if (!insumo || insumo.cantidad_disponible < consumo.cantidad) {
        faltantes.push(insumo?.nombre || 'Insumo desconocido');
      }
    }

    return { valido: faltantes.length === 0, faltantes };
  }, [insumos]);

  // Obtener insumo por ID
  const obtenerInsumo = useCallback((id: string) => 
    insumos.find(i => i.id === id),
    [insumos]
  );

  return {
    insumos,
    loadingState,
    error,
    insumosStockBajo,
    valorTotalInventario,
    crearInsumo,
    editarInsumo,
    eliminarInsumo,
    registrarMovimiento,
    descontarStock,
    verificarStock,
    obtenerInsumo,
    STOCK_BAJO_UMBRAL,

    // 👇 Unidades de medida
    unidadesMedida,
    loadingUnidades,
    errorUnidades,

    // 👇 Paginación
    meta,
    page,
    limit,
    nextPage,
    prevPage,
    goToPage,
    fetchInsumos,
  };
};
