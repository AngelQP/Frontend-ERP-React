
import { api } from "@/lib/axios";
import type { RegisterRequest, RegisterResponse } from "@/features/auth/types/register.type";
import type { LoginRequest, LoginResponse } from "@/features/auth/types/login.type";

export const registerUser = async (payload: RegisterRequest ): Promise<RegisterResponse> => {
    const { data } = await api.post<RegisterResponse>("/auth/register", payload);
    return data;
}

export const loginUser = async (payload: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", payload);
    return data;
}