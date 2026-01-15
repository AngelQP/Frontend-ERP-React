import { useState, useCallback, useMemo } from 'react';
import { type Postre, type PostreFormData, type PostreConCosto, type RecetaItem, type  LoadingState,  type ApiError, BUSINESS_ERRORS } from '@/types';
import { toast } from 'sonner';
import { useInsumos } from './useInsumos';

// Datos iniciales mock
const initialPostres: Postre[] = [
  {
    id: '1',
    nombre: 'Pastel de Chocolate',
    descripcion: 'Delicioso pastel de 3 capas',
    precio_referencia: 450,
    receta: [
      { insumo_id: '1', cantidad_utilizada: 0.5 }, // Harina
      { insumo_id: '2', cantidad_utilizada: 0.3 }, // Azúcar
      { insumo_id: '3', cantidad_utilizada: 4 },   // Huevos
      { insumo_id: '6', cantidad_utilizada: 0.2 }, // Chocolate
    ],
  },
  {
    id: '2',
    nombre: 'Cheesecake NY',
    descripcion: 'Clásico cheesecake horneado',
    precio_referencia: 380,
    receta: [
      { insumo_id: '3', cantidad_utilizada: 3 },   // Huevos
      { insumo_id: '4', cantidad_utilizada: 0.2 }, // Mantequilla
      { insumo_id: '2', cantidad_utilizada: 0.2 }, // Azúcar
    ],
  },
  {
    id: '3',
    nombre: 'Cupcakes (12)',
    descripcion: 'Docena de cupcakes variados',
    precio_referencia: 180,
    receta: [
      { insumo_id: '1', cantidad_utilizada: 0.3 }, // Harina
      { insumo_id: '2', cantidad_utilizada: 0.2 }, // Azúcar
      { insumo_id: '3', cantidad_utilizada: 2 },   // Huevos
      { insumo_id: '7', cantidad_utilizada: 10 },  // Vainilla
    ],
  },
  {
    id: '4',
    nombre: 'Brownies (6)',
    descripcion: 'Media docena de brownies',
    precio_referencia: 90,
    receta: [
      { insumo_id: '6', cantidad_utilizada: 0.15 }, // Chocolate
      { insumo_id: '4', cantidad_utilizada: 0.1 },  // Mantequilla
      { insumo_id: '3', cantidad_utilizada: 2 },    // Huevos
    ],
  },
];

export const usePostres = () => {
  const [postres, setPostres] = useState<Postre[]>(initialPostres);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);
  const { insumos, obtenerInsumo } = useInsumos();

  // Simula delay de API
  const simulateApi = () => new Promise(resolve => setTimeout(resolve, 300));

  // Calcular costo de una receta
  const calcularCostoReceta = useCallback((receta: RecetaItem[]): number => {
    return receta.reduce((total, item) => {
      const insumo = obtenerInsumo(item.insumo_id);
      if (insumo) {
        return total + (insumo.costo_unitario * item.cantidad_utilizada);
      }
      return total;
    }, 0);
  }, [obtenerInsumo]);

  // Postres con costo calculado
  const postresConCosto = useMemo((): PostreConCosto[] => {
    return postres.map(postre => {
      const costo_total = calcularCostoReceta(postre.receta);
      const margen = postre.precio_referencia > 0 
        ? ((postre.precio_referencia - costo_total) / postre.precio_referencia) * 100 
        : 0;
      
      return {
        ...postre,
        costo_total,
        margen,
      };
    });
  }, [postres, calcularCostoReceta]);

  // Validar receta
  const validarReceta = useCallback((receta: RecetaItem[]): { valida: boolean; error?: string } => {
    if (receta.length === 0) {
      return { valida: false, error: BUSINESS_ERRORS.RECETA_VACIA };
    }

    // Verificar insumos duplicados
    const ids = receta.map(r => r.insumo_id);
    const unicos = new Set(ids);
    if (unicos.size !== ids.length) {
      return { valida: false, error: BUSINESS_ERRORS.INSUMO_DUPLICADO };
    }

    // Verificar cantidades válidas
    for (const item of receta) {
      if (item.cantidad_utilizada <= 0) {
        return { valida: false, error: BUSINESS_ERRORS.CANTIDAD_INVALIDA };
      }
    }

    return { valida: true };
  }, []);

  // Crear postre
  const crearPostre = useCallback(async (data: PostreFormData) => {
    setLoadingState('loading');
    setError(null);
    
    try {
      await simulateApi();
      
      // Validaciones
      if (data.precio_referencia <= 0) {
        throw { code: 'PRECIO_INVALIDO', message: BUSINESS_ERRORS.PRECIO_INVALIDO };
      }

      const validacion = validarReceta(data.receta);
      if (!validacion.valida) {
        throw { code: 'RECETA_INVALIDA', message: validacion.error };
      }

      const nuevoPostre: Postre = {
        id: Date.now().toString(),
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio_referencia: data.precio_referencia,
        receta: data.receta,
      };

      setPostres(prev => [...prev, nuevoPostre]);
      setLoadingState('success');
      toast.success('Postre creado correctamente');
      return nuevoPostre;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      setLoadingState('error');
      toast.error(apiError.message || 'Error al crear postre');
      throw err;
    }
  }, [validarReceta]);

  // Editar postre
  const editarPostre = useCallback(async (id: string, data: Partial<PostreFormData>) => {
    setLoadingState('loading');
    setError(null);
    
    try {
      await simulateApi();
      
      if (data.precio_referencia !== undefined && data.precio_referencia <= 0) {
        throw { code: 'PRECIO_INVALIDO', message: BUSINESS_ERRORS.PRECIO_INVALIDO };
      }

      if (data.receta) {
        const validacion = validarReceta(data.receta);
        if (!validacion.valida) {
          throw { code: 'RECETA_INVALIDA', message: validacion.error };
        }
      }

      setPostres(prev => prev.map(p => 
        p.id === id ? { ...p, ...data } : p
      ));
      
      setLoadingState('success');
      toast.success('Postre actualizado correctamente');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      setLoadingState('error');
      toast.error(apiError.message || 'Error al actualizar postre');
      throw err;
    }
  }, [validarReceta]);

  // Eliminar postre
  const eliminarPostre = useCallback(async (id: string) => {
    setLoadingState('loading');
    setError(null);
    
    try {
      await simulateApi();
      setPostres(prev => prev.filter(p => p.id !== id));
      setLoadingState('success');
      toast.success('Postre eliminado correctamente');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      setLoadingState('error');
      toast.error(apiError.message || 'Error al eliminar postre');
      throw err;
    }
  }, []);

  // Obtener postre por ID
  const obtenerPostre = useCallback((id: string) => 
    postres.find(p => p.id === id),
    [postres]
  );

  return {
    postres,
    postresConCosto,
    loadingState,
    error,
    insumos,
    crearPostre,
    editarPostre,
    eliminarPostre,
    obtenerPostre,
    calcularCostoReceta,
    validarReceta,
    obtenerInsumo,
  };
};
