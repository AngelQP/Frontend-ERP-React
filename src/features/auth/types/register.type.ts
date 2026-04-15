
export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    lastName: string;
    phone: string;
}

export interface RegisterResponse {
  verificationUrl: string;
  expirationTime: number;
  message: string;
};

export interface ResetPasswordResponse {
  resetUrl: string | null;
  expirationTime: number;
  message: string;
};
