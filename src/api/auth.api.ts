
import { apiPublic } from "@/lib/axios";
import type { RegisterRequest, RegisterResponse, ResetPasswordResponse } from "@/features/auth/types/register.type";
import type { LoginRequest, LoginResponse } from "@/features/auth/types/login.type";

export const registerUser = async (payload: RegisterRequest ): Promise<RegisterResponse> => {

    const {data}  = await apiPublic.post<RegisterResponse>("/auth/register", payload);

    console.log(data);
    return data;
}

export const loginUser = async (payload: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiPublic.post<LoginResponse>("/auth/login", payload);
    return data;
}

export const verifyEmail = async (token: string): Promise<{ message: string }> => {
  const { data } = await apiPublic.post("/verification-token/verify-email", {
    token,
  });
  return data;
};

export const resendVerification = async (email: string) => {
  const { data } = await apiPublic.post("/verification-token/resend-verification", {
    email,
  });
  return data;
};

export const requestPasswordReset = async (email: string): Promise<ResetPasswordResponse> => {
  const { data } = await apiPublic.post("/auth/request-password-reset", {
    email,
  });
  return data;
};

export const resetPassword = async (payload: { token: string; password: string }) => {
  const { data } = await apiPublic.post("/auth/reset-password", payload);
  return data;
};