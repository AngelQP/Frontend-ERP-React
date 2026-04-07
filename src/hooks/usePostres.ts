import { useState, useCallback, useMemo, useEffect } from 'react';
import { type  LoadingState,  type ApiError, BUSINESS_ERRORS } from '@/types';
import { toast } from 'sonner';
import { useInsumos } from './useInsumos';
import type { PostrePaginationMeta } from "@/features/postres/types/postre.api.types";

import {
  createPostre,
  updatePostre,
  deletePostre,
  getPostres,
} from "@/api/postre.api";
import type { Postre, PostreConCosto, PostreFormData, RecetaItem } from '@/features/postres/types/postre.types';

// Datos iniciales mock
// const initialPostres: Postre[] = [
//   {
//     id: '1',
//     nombre: 'Pastel de Chocolate',
//     descripcion: 'Delicioso pastel de 3 capas',
//     precio_referencia: 450,
//     receta: [
//       { insumo_id: '1', cantidad: 0.5 }, // Harina
//       { insumo_id: '2', cantidad: 0.3 }, // Azúcar
//       { insumo_id: '3', cantidad: 4 },   // Huevos
//       { insumo_id: '6', cantidad: 0.2 }, // Chocolate
//     ],
//   },
//   {
//     id: '2',
//     nombre: 'Cheesecake NY',
//     descripcion: 'Clásico cheesecake horneado',
//     precio_referencia: 380,
//     receta: [
//       { insumo_id: '3', cantidad: 3 },   // Huevos
//       { insumo_id: '4', cantidad: 0.2 }, // Mantequilla
//       { insumo_id: '2', cantidad: 0.2 }, // Azúcar
//     ],
//   },
//   {
//     id: '3',
//     nombre: 'Cupcakes (12)',
//     descripcion: 'Docena de cupcakes variados',
//     precio_referencia: 180,
//     receta: [
//       { insumo_id: '1', cantidad: 0.3 }, // Harina
//       { insumo_id: '2', cantidad: 0.2 }, // Azúcar
//       { insumo_id: '3', cantidad: 2 },   // Huevos
//       { insumo_id: '7', cantidad: 10 },  // Vainilla
//     ],
//   },
//   {
//     id: '4',
//     nombre: 'Brownies (6)',
//     descripcion: 'Media docena de brownies',
//     precio_referencia: 90,
//     receta: [
//       { insumo_id: '6', cantidad_utilizada: 0.15 }, // Chocolate
//       { insumo_id: '4', cantidad_utilizada: 0.1 },  // Mantequilla
//       { insumo_id: '3', cantidad_utilizada: 2 },    // Huevos
//     ],
//   },
// ];

export const usePostres = () => {
  const [postres, setPostres] = useState<Postre[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);
  const { insumos, obtenerInsumo } = useInsumos();

  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [meta, setMeta] = useState<PostrePaginationMeta | null>(null);

  // Simula delay de API
  // const simulateApi = () => new Promise(resolve => setTimeout(resolve, 300));

  // Calcular costo de una receta
  const calcularCostoReceta = useCallback((receta: RecetaItem[]): number => {
    return receta.reduce((total, item) => {
      const insumo = obtenerInsumo(item.insumo_id);
      if (insumo) {
        return total + (insumo.costo_unitario * item.cantidad);
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
      if (item.cantidad <= 0) {
        return { valida: false, error: BUSINESS_ERRORS.CANTIDAD_INVALIDA };
      }
    }

    return { valida: true };
  }, []);

  // Crear postre
  const crearPostre = useCallback(async (data: PostreFormData) => {
    setLoadingState("loading");
    setError(null);

    try {
      await createPostre(data)
      // const nuevo = await createPostre(data);

      // const postreAdaptado: Postre = {
      //   id: nuevo.id,
      //   nombre: nuevo.nombre,
      //   descripcion: nuevo.descripcion,
      //   precio_referencia: Number(nuevo.precio_referencia),
      //   rendimiento_base: Number(nuevo.rendimiento_base),
      //   receta: nuevo.receta.map((r: any) => ({
      //     insumo_id: r.insumo_id,  // ✅
      //     cantidad: Number(r.cantidad),
      //   })),
      // };

      // setPostres((prev) => [...prev, postreAdaptado]);
      await fetchPostres(page);

      setLoadingState("success");
      toast.success("Postre creado correctamente");
    } catch (err: any) {
      setLoadingState("error");
      toast.error(err.response?.data?.message || "Error al crear postre");
      throw err;
    }
  }, []);

  // Editar postre
  const editarPostre = useCallback(
    async (id: string, data: PostreFormData) => {
      setLoadingState("loading");
      setError(null);

      try {
        await updatePostre(id, data)
        // const actualizado = await updatePostre(id, data);

        // const postreAdaptado: Postre = {
        //   id: actualizado.id,
        //   nombre: actualizado.nombre,
        //   descripcion: actualizado.descripcion,
        //   precio_referencia: Number(actualizado.precio_referencia),
        //   rendimiento_base: Number(actualizado.rendimiento_base),
        //   receta: actualizado.receta.map((r: any) => ({
        //     insumo_id: r.insumo_id, 
        //     cantidad: Number(r.cantidad),
        //   })),
        // };

        // setPostres((prev) =>
        //   prev.map((p) => (p.id === id ? postreAdaptado : p))
        // );

        await fetchPostres(page);

        setLoadingState("success");
        toast.success("Postre actualizado correctamente");
      } catch (err: any) {
        setLoadingState("error");
        toast.error(err.response?.data?.message || "Error al actualizar");
        throw err;
      }
    },
    []
  );

  // Eliminar postre
  const eliminarPostre = useCallback(async (id: string) => {
    setLoadingState("loading");
    setError(null);

    try {
      await deletePostre(id);

      // setPostres((prev) => prev.filter((p) => p.id !== id));

      await fetchPostres(page);

      setLoadingState("success");
      toast.success("Postre eliminado correctamente");
    } catch (err: any) {
      setLoadingState("error");
      toast.error(err.response?.data?.message || "Error al eliminar");
      throw err;
    }
  }, []);

  // Obtener todos los postres
  // useEffect(() => {
  //   const fetchPostres = async () => {
  //     setLoadingState("loading");
  //     try {
  //       const data = await getPostres();
        
  //       const adaptados: Postre[] = data.map((p: any) => ({
  //         id: p.id,
  //         nombre: p.nombre,
  //         descripcion: p.descripcion,
  //         precio_referencia: Number(p.precio_referencia),
  //         rendimiento_base: Number(p.rendimiento_base),
  //         receta: p.receta.map((r: any) => ({
  //           insumo_id: r.insumo_id, 
  //           cantidad: Number(r.cantidad),
  //         })),
  //       }));


  //       setPostres(adaptados);
  //       setLoadingState("success");
  //     } catch (err) {
  //       setLoadingState("error");
  //       toast.error("Error al cargar postres");
  //     }
  //   };

  //   fetchPostres();
  // }, []);

  const fetchPostres = useCallback(async (currentPage: number) => {
    setLoadingState("loading");

    try {
      const response = await getPostres(currentPage, limit);

      setPostres(response.postres);
      setMeta(response.meta);

      setLoadingState("success");
    } catch (err) {
      setLoadingState("error");
      toast.error("Error al cargar postres");
    }
  }, [limit]);

  useEffect(() => {
    fetchPostres(page);
  }, [page, fetchPostres]);  

  // Obtener postre por ID
  const obtenerPostre = useCallback((id: string) => 
    postres.find(p => p.id === id),
    [postres]
  );

  // funciones de paginacion
  const nextPage = () => {
    if (meta?.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (meta?.hasPrevPage) {
      setPage((prev) => prev - 1);
    }
  };

  const goToPage = (newPage: number) => {
    if (meta && newPage >= 1 && newPage <= meta.totalPages) {
      setPage(newPage);
    }
  };

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

    page,
    limit,
    meta,
    nextPage,
    prevPage,
    goToPage,
    fetchPostres,
  };
};
