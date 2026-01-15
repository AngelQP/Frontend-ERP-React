// ============= Tipos de dominio del ERP =============

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

// Unidades de medida válidas
export type UnidadMedida = 'kg' | 'g' | 'L' | 'ml' | 'pza';

export const UNIDADES_MEDIDA: { value: UnidadMedida; label: string }[] = [
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'L', label: 'Litros (L)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'pza', label: 'Piezas (pza)' },
];

// ============= INSUMOS =============
export interface Insumo {
  id: string;
  nombre: string;
  unidad_medida: UnidadMedida;
  cantidad_disponible: number;
  costo_unitario: number;
}

export interface InsumoFormData {
  nombre: string;
  unidad_medida: UnidadMedida;
  cantidad_disponible: number;
  costo_unitario: number;
}

// ============= POSTRES =============
export interface RecetaItem {
  insumo_id: string;
  cantidad_utilizada: number;
}

export interface Postre {
  id: string;
  nombre: string;
  descripcion?: string;
  precio_referencia: number;
  receta: RecetaItem[];
  imagen_url?: string;
}

export interface PostreFormData {
  nombre: string;
  descripcion?: string;
  precio_referencia: number;
  receta: RecetaItem[];
}

// Postre con costo calculado (para mostrar en UI)
export interface PostreConCosto extends Postre {
  costo_total: number;
  margen: number;
}

// ============= VENTAS =============
export interface Venta {
  id: string;
  postre_id: string;
  precio_venta: number;
  cantidad: number;
  fecha: Date;
  insumos_consumidos: RecetaItem[];
}

export interface VentaFormData {
  postre_id: string;
  precio_venta: number;
  cantidad: number;
}

// Venta con datos del postre (para mostrar en UI)
export interface VentaConDetalle extends Venta {
  postre_nombre: string;
}

// ============= DASHBOARD =============
export interface DashboardStats {
  totalIngresos: number;
  totalGastos: number;
  balance: number;
  cantidadVentas: number;
  postreMasVendido: { nombre: string; cantidad: number } | null;
}

export interface DashboardFilters {
  mes: number; // 0-11
  anio: number;
}

// ============= Estados de la aplicación =============
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiError {
  code: string;
  message: string;
}

// Errores de negocio comunes
export const BUSINESS_ERRORS = {
  STOCK_INSUFICIENTE: 'No hay suficiente stock de insumos para esta venta',
  PRECIO_INVALIDO: 'El precio debe ser mayor a 0',
  CANTIDAD_INVALIDA: 'La cantidad debe ser mayor a 0',
  INSUMO_DUPLICADO: 'No se puede agregar el mismo insumo dos veces',
  RECETA_VACIA: 'El postre debe tener al menos un insumo en su receta',
} as const;
