
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    id: string;
    email: string;
    name: string;
    lastName: string;
    token: string;
}