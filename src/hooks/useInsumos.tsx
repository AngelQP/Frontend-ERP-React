import { useState, useCallback, useMemo } from 'react';
import {type Insumo, type InsumoFormData, type LoadingState, type ApiError } from '@/types';
import { toast } from 'sonner';

// Datos iniciales mock (simula API)
const initialInsumos: Insumo[] = [
  { id: '1', nombre: 'Harina', unidad_medida: 'kg', costo_unitario: 25, cantidad_disponible: 10 },
  { id: '2', nombre: 'Azúcar', unidad_medida: 'kg', costo_unitario: 30, cantidad_disponible: 8 },
  { id: '3', nombre: 'Huevos', unidad_medida: 'pza', costo_unitario: 4, cantidad_disponible: 24 },
  { id: '4', nombre: 'Mantequilla', unidad_medida: 'kg', costo_unitario: 120, cantidad_disponible: 3 },
  { id: '5', nombre: 'Leche', unidad_medida: 'L', costo_unitario: 28, cantidad_disponible: 5 },
  { id: '6', nombre: 'Chocolate', unidad_medida: 'kg', costo_unitario: 180, cantidad_disponible: 2 },
  { id: '7', nombre: 'Vainilla', unidad_medida: 'ml', costo_unitario: 0.5, cantidad_disponible: 200 },
  { id: '8', nombre: 'Polvo para hornear', unidad_medida: 'kg', costo_unitario: 85, cantidad_disponible: 1 },
];

const STOCK_BAJO_UMBRAL = 5;

export const useInsumos = () => {
  const [insumos, setInsumos] = useState<Insumo[]>(initialInsumos);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);

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
      await simulateApi();
      
      // Validaciones de negocio
      if (data.cantidad_disponible < 0) {
        throw { code: 'CANTIDAD_INVALIDA', message: 'La cantidad no puede ser negativa' };
      }
      if (data.costo_unitario <= 0) {
        throw { code: 'COSTO_INVALIDO', message: 'El costo debe ser mayor a 0' };
      }

      const nuevoInsumo: Insumo = {
        id: Date.now().toString(),
        ...data,
      };

      setInsumos(prev => [...prev, nuevoInsumo]);
      setLoadingState('success');
      toast.success('Insumo creado correctamente');
      return nuevoInsumo;
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
      
      // Validaciones
      if (data.cantidad_disponible !== undefined && data.cantidad_disponible < 0) {
        throw { code: 'CANTIDAD_INVALIDA', message: 'La cantidad no puede ser negativa' };
      }
      if (data.costo_unitario !== undefined && data.costo_unitario <= 0) {
        throw { code: 'COSTO_INVALIDO', message: 'El costo debe ser mayor a 0' };
      }

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
      await simulateApi();
      setInsumos(prev => prev.filter(i => i.id !== id));
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
    descontarStock,
    verificarStock,
    obtenerInsumo,
    STOCK_BAJO_UMBRAL,
  };
};
