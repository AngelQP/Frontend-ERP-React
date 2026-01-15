
export interface RegisterRequest {

    email: string;
    password: string;
    name: string;
    lastName: string;
    phone: string;
}

export interface RegisterResponse { 
    id: string;
    email: string;
    name: string;
    lastName: string;
    token?: string;
}

