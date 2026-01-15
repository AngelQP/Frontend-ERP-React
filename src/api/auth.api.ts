
import { api } from "@/lib/axios";
import { type RegisterRequest, type RegisterResponse } from "@/features/auth/types/register.type";

export const registerUser = async (payload: RegisterRequest ): Promise<RegisterResponse> => {
    const { data } = await api.post<RegisterResponse>("/auth/register", payload);
    return data;
}