

export interface InsumoRequestCreate {
    nombre: string;
    unidad: string;
}

export interface InsumoRequestUpdate {
    id: string;
    nombre: string;
    unidad: string;
}

export interface InsumoResponse {
    id: string;
    nombre: string;
    unidad: string;
}