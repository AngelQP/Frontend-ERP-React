import { useState, useCallback, useMemo } from 'react';
import { type Venta, type VentaFormData, type VentaConDetalle, type RecetaItem, type LoadingState, type ApiError, BUSINESS_ERRORS } from '@/types';
import { toast } from 'sonner';
import { usePostres } from './usePostres';
import { useInsumos } from './useInsumos';

// Datos iniciales mock
const initialVentas: Venta[] = [
  {
    id: '1',
    postre_id: '1',
    precio_venta: 450,
    cantidad: 1,
    fecha: new Date('2024-01-15'),
    insumos_consumidos: [
      { insumo_id: '1', cantidad_utilizada: 0.5 },
      { insumo_id: '2', cantidad_utilizada: 0.3 },
      { insumo_id: '3', cantidad_utilizada: 4 },
      { insumo_id: '6', cantidad_utilizada: 0.2 },
    ],
  },
  {
    id: '2',
    postre_id: '3',
    precio_venta: 180,
    cantidad: 2,
    fecha: new Date('2024-01-15'),
    insumos_consumidos: [
      { insumo_id: '1', cantidad_utilizada: 0.6 },
      { insumo_id: '2', cantidad_utilizada: 0.4 },
      { insumo_id: '3', cantidad_utilizada: 4 },
      { insumo_id: '7', cantidad_utilizada: 20 },
    ],
  },
  {
    id: '3',
    postre_id: '2',
    precio_venta: 380,
    cantidad: 1,
    fecha: new Date('2024-01-14'),
    insumos_consumidos: [
      { insumo_id: '3', cantidad_utilizada: 3 },
      { insumo_id: '4', cantidad_utilizada: 0.2 },
      { insumo_id: '2', cantidad_utilizada: 0.2 },
    ],
  },
  {
    id: '4',
    postre_id: '4',
    precio_venta: 90,
    cantidad: 3,
    fecha: new Date('2024-01-14'),
    insumos_consumidos: [
      { insumo_id: '6', cantidad_utilizada: 0.45 },
      { insumo_id: '4', cantidad_utilizada: 0.3 },
      { insumo_id: '3', cantidad_utilizada: 6 },
    ],
  },
];

export const useVentas = () => {
  const [ventas, setVentas] = useState<Venta[]>(initialVentas);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);
  
  const { postres, obtenerPostre, calcularCostoReceta } = usePostres();
  const { insumos, verificarStock, descontarStock, obtenerInsumo } = useInsumos();

  // Simula delay de API
  const simulateApi = () => new Promise(resolve => setTimeout(resolve, 300));

  // Ventas con detalle de postre
  const ventasConDetalle = useMemo((): VentaConDetalle[] => {
    return ventas.map(venta => {
      const postre = obtenerPostre(venta.postre_id);
      return {
        ...venta,
        postre_nombre: postre?.nombre || 'Postre eliminado',
      };
    }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [ventas, obtenerPostre]);

  // Calcular insumos a consumir basado en receta y cantidad
  const calcularConsumos = useCallback((postre_id: string, cantidad: number): RecetaItem[] => {
    const postre = obtenerPostre(postre_id);
    if (!postre) return [];

    return postre.receta.map(item => ({
      insumo_id: item.insumo_id,
      cantidad_utilizada: item.cantidad_utilizada * cantidad,
    }));
  }, [obtenerPostre]);

  // Preparar resumen de venta (antes de confirmar)
  const prepararResumenVenta = useCallback((data: VentaFormData) => {
    const postre = obtenerPostre(data.postre_id);
    if (!postre) return null;

    const consumos = calcularConsumos(data.postre_id, data.cantidad);
    const verificacion = verificarStock(consumos.map(c => ({ 
      insumo_id: c.insumo_id, 
      cantidad: c.cantidad_utilizada 
    })));

    const detalleConsumos = consumos.map(c => {
      const insumo = obtenerInsumo(c.insumo_id);
      return {
        insumo_id: c.insumo_id,
        nombre: insumo?.nombre || 'Desconocido',
        unidad: insumo?.unidad_medida || '',
        cantidad: c.cantidad_utilizada,
        stock_actual: insumo?.cantidad_disponible || 0,
        suficiente: (insumo?.cantidad_disponible || 0) >= c.cantidad_utilizada,
      };
    });

    return {
      postre_nombre: postre.nombre,
      precio_referencia: postre.precio_referencia,
      precio_venta: data.precio_venta,
      cantidad: data.cantidad,
      total: data.precio_venta * data.cantidad,
      costo_total: calcularCostoReceta(postre.receta) * data.cantidad,
      consumos: detalleConsumos,
      stock_suficiente: verificacion.valido,
      insumos_faltantes: verificacion.faltantes,
    };
  }, [obtenerPostre, calcularConsumos, verificarStock, obtenerInsumo, calcularCostoReceta]);

  // Registrar venta
  const registrarVenta = useCallback(async (data: VentaFormData) => {
    setLoadingState('loading');
    setError(null);
    
    try {
      await simulateApi();
      
      // Validaciones
      if (data.precio_venta <= 0) {
        throw { code: 'PRECIO_INVALIDO', message: BUSINESS_ERRORS.PRECIO_INVALIDO };
      }
      if (data.cantidad <= 0) {
        throw { code: 'CANTIDAD_INVALIDA', message: BUSINESS_ERRORS.CANTIDAD_INVALIDA };
      }

      const postre = obtenerPostre(data.postre_id);
      if (!postre) {
        throw { code: 'POSTRE_NO_EXISTE', message: 'El postre seleccionado no existe' };
      }

      // Calcular y verificar consumos
      const consumos = calcularConsumos(data.postre_id, data.cantidad);
      const verificacion = verificarStock(consumos.map(c => ({ 
        insumo_id: c.insumo_id, 
        cantidad: c.cantidad_utilizada 
      })));

      if (!verificacion.valido) {
        throw { 
          code: 'STOCK_INSUFICIENTE', 
          message: `${BUSINESS_ERRORS.STOCK_INSUFICIENTE}: ${verificacion.faltantes.join(', ')}` 
        };
      }

      // Crear venta
      const nuevaVenta: Venta = {
        id: Date.now().toString(),
        postre_id: data.postre_id,
        precio_venta: data.precio_venta,
        cantidad: data.cantidad,
        fecha: new Date(),
        insumos_consumidos: consumos,
      };

      // Descontar inventario
      descontarStock(consumos.map(c => ({ insumo_id: c.insumo_id, cantidad: c.cantidad_utilizada })));

      setVentas(prev => [...prev, nuevaVenta]);
      setLoadingState('success');
      toast.success('Venta registrada correctamente');
      return nuevaVenta;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      setLoadingState('error');
      toast.error(apiError.message || 'Error al registrar venta');
      throw err;
    }
  }, [obtenerPostre, calcularConsumos, verificarStock, descontarStock]);

  // Estadísticas por período
  const obtenerEstadisticas = useCallback((mes: number, anio: number) => {
    const ventasFiltradas = ventas.filter(v => {
      const fecha = new Date(v.fecha);
      return fecha.getMonth() === mes && fecha.getFullYear() === anio;
    });

    const totalIngresos = ventasFiltradas.reduce((acc, v) => acc + (v.precio_venta * v.cantidad), 0);
    
    const totalGastos = ventasFiltradas.reduce((acc, v) => {
      return acc + v.insumos_consumidos.reduce((sum, c) => {
        const insumo = obtenerInsumo(c.insumo_id);
        return sum + ((insumo?.costo_unitario || 0) * c.cantidad_utilizada);
      }, 0);
    }, 0);

    // Postre más vendido
    const ventasPorPostre: Record<string, number> = {};
    ventasFiltradas.forEach(v => {
      ventasPorPostre[v.postre_id] = (ventasPorPostre[v.postre_id] || 0) + v.cantidad;
    });

    let postreMasVendido = null;
    let maxVentas = 0;
    for (const [postreId, cantidad] of Object.entries(ventasPorPostre)) {
      if (cantidad > maxVentas) {
        maxVentas = cantidad;
        const postre = obtenerPostre(postreId);
        postreMasVendido = { nombre: postre?.nombre || 'Desconocido', cantidad };
      }
    }

    return {
      totalIngresos,
      totalGastos,
      balance: totalIngresos - totalGastos,
      cantidadVentas: ventasFiltradas.length,
      postreMasVendido,
    };
  }, [ventas, obtenerInsumo, obtenerPostre]);

  // Ventas de hoy
  const ventasHoy = useMemo(() => {
    const hoy = new Date();
    return ventas.filter(v => {
      const fecha = new Date(v.fecha);
      return fecha.toDateString() === hoy.toDateString();
    });
  }, [ventas]);

  return {
    ventas,
    ventasConDetalle,
    loadingState,
    error,
    postres,
    insumos,
    ventasHoy,
    registrarVenta,
    prepararResumenVenta,
    calcularConsumos,
    obtenerEstadisticas,
    obtenerPostre,
    obtenerInsumo,
  };
};
