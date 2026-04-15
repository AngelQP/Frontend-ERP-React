import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, User, Lock, ArrowRight, ArrowLeft, Cake } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

// import { apiPublic } from "@/lib/axios";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/features/auth/types/api.error";

import { registerUser } from "@/api/auth.api";

// Correo importacion
import emailjs from '@emailjs/browser';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  // Estados para manejo de axios
  const  [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  /** Verificacion de email */

  const sendVerificationEmail = async (email: string, expirationTime: number, verificationUrl: string) => {
    
    console.log("Enviando correo de verificación a:", email);

    if (!email || !verificationUrl) {
      console.error("Faltan datos para enviar el correo");
      return false;
    }

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE,
        import.meta.env.VITE_EMAILJS_TEMPLATE_VERIFY,
        {
          to_email: email,
          verification_url: verificationUrl,
          expiration_time: expirationTime,
          year: new Date().getFullYear(),
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      return true;
    } catch (error) {
      console.error('Error enviando correo:', error);
      return false;
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Nombre requerido";
    if (!formData.lastName.trim()) newErrors.lastName = "Apellidos requeridos";
    if (!formData.phone.trim()) newErrors.phone = "Celular requerido";
    else if (!/^\d{9}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Ingresa un número válido de 9 dígitos";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.email.trim()) newErrors.email = "Correo requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo inválido";
    }
    if (!formData.password) newErrors.password = "Contraseña requerida";
    else if (formData.password.length < 8) {
      newErrors.password = "Mínimo 8 caracteres";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (! validateStep2() ) return;

    try {
      setLoading(true);

      // se carga payload del formulario
      const payload = {
        email: formData.email,
        password: formData.password,
        name: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      };

      const {expirationTime, verificationUrl} = await registerUser(payload);

      // console.log(payload);

      toast.success("Cuenta creada 🎉 Revisa tu correo para verificarla");

      // 👇 ENVÍAS EL EMAIL
      const flagEnvio = await sendVerificationEmail(formData.email, expirationTime, verificationUrl);

      if(flagEnvio) {
        toast.success("Cuenta creada 🎉 Revisa tu correo para verificarla");
      } else {
        toast.error("Error al enviar correo de verificación ❌");
      }

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {

      const err = error as AxiosError<ApiErrorResponse>;

      console.log(err);

      const rawMessage = err.response?.data?.message;

      console.log(rawMessage)

      const backendMessage = getErrorMessage(err.response?.data?.message);

      toast.error(backendMessage)

    } finally {
      setLoading(false);
    }

  };

  function getErrorMessage(message: unknown): string {
    if (!message) return "Error al registrar usuario";

    // string
    if (typeof message === "string") {
      return message;
    }

    // array de strings
    if (Array.isArray(message)) {
      return message.join(", ");
    }

    // objeto { title, message }
    if (typeof message === "object") {
      const msgObj = message as { title?: string; message?: string };

    return msgObj.message || msgObj.title || "Error al registrar usuario";
  }

  return "Error al registrar usuario";
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 shadow-lg">
            <Cake className="w-8 h-8 text-primary-foreground" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Dulce Control</h1>
          <p className="text-muted-foreground mt-1">Tu ERP de pastelería</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  step >= 1 ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {step > 1 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span className={`text-sm ${step >= 1 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                Datos personales
              </span>
            </div>
            <div className="flex-1 h-0.5 mx-4 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full gradient-primary transition-all duration-500 ease-out ${
                  step >= 2 ? "w-full" : "w-0"
                }`}
              />
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  step >= 2 ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <span className={`text-sm ${step >= 2 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                Credenciales
              </span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="card-elevated p-8 animate-scale-in">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary-light">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Datos personales</h2>
                    <p className="text-sm text-muted-foreground">Cuéntanos sobre ti</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      placeholder="María"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      className={errors.firstName ? "border-destructive" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-destructive animate-fade-in">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellidos</Label>
                    <Input
                      id="lastName"
                      placeholder="García López"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      className={errors.lastName ? "border-destructive" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-destructive animate-fade-in">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Celular</Label>
                  <Input
                    id="phone"
                    placeholder="979 979 123"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && <p className="text-xs text-destructive animate-fade-in">{errors.phone}</p>}
                </div>

                <Button type="button" onClick={handleNext} className="w-full" size="lg">
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-secondary-light">
                    <Lock className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Credenciales</h2>
                    <p className="text-sm text-muted-foreground">Configura tu acceso</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="maria@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-xs text-destructive animate-fade-in">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive animate-fade-in">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                    className={errors.confirmPassword ? "border-destructive" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive animate-fade-in">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1" size="lg">
                    <ArrowLeft className="w-4 h-4" />
                    Atrás
                  </Button>
                  <Button type="submit" className="flex-1" size="lg" disabled={loading} >
                    { loading ? "Creando..." : "Crear cuenta" }
                  </Button>
                </div>
              </div>
            )}
          </form>

        </div>

        {/* Login Link */}
        <p className="text-center mt-6 text-sm text-muted-foreground animate-fade-in">
          ¿Ya tienes cuenta?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-primary font-medium hover:underline transition-colors"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
