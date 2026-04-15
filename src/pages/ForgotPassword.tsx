import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cake, Mail } from "lucide-react";
import { Link } from "react-router-dom";

import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

import { requestPasswordReset } from "@/api/auth.api";

// Correo importacion
import emailjs from '@emailjs/browser';

const ForgotPassword = () => {

  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {

    const newErrors: { email?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Correo requerido";
    } 
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Correo inválido";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const sendResetEmail = async (
    email: string,
    expirationTime: number,
    resetUrl: string
  ) => {

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE,
        import.meta.env.VITE_EMAILJS_TEMPLATE_RESET,
        {
          to_email: email,
          reset_url: resetUrl,
          expiration_time: expirationTime,
          year: new Date().getFullYear(),
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!validate()) return;

    try {

      setIsLoading(true);

      const { expirationTime, resetUrl } = await requestPasswordReset(email);

      if (resetUrl) {
        try {
          await sendResetEmail(email, expirationTime, resetUrl);
        } catch (error) {
          console.log("Email falla. UX intacta pero revisar logs:", error);
        }
      }

      toast({
          title: "Código enviado",
          description: "Revisa tu correo para continuar con la recuperación",
          duration: 3000,
      });

      setTimeout(() => {
          navigate("/");
      }, 2000);
      

    } catch (error) {

      toast({
        title: "Error",
        description: "No se pudo enviar el código",
        variant: "destructive",
      });

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">

          <Link
            to="/"
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 shadow-lg"
          >
            <Cake className="w-8 h-8 text-primary-foreground" />
          </Link>

          <h1 className="text-2xl font-bold text-foreground">
            Dulce Control
          </h1>

          <p className="text-muted-foreground mt-1">
            Recuperar contraseña
          </p>

        </div>

        {/* Card */}
        <div className="card-elevated p-8 animate-scale-in">

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-2">

              <Label htmlFor="email">
                Correo electrónico
              </Label>

              <div className="relative">

                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                />

              </div>

              {errors.email && (
                <p className="text-xs text-destructive animate-fade-in">
                  {errors.email}
                </p>
              )}

            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                "Enviar código"
              )}
            </Button>

          </form>

        </div>

        {/* volver */}
        <p className="text-center mt-6 text-sm text-muted-foreground animate-fade-in">

          <Link
            to="/login"
            className="text-primary font-medium hover:underline transition-colors"
          >
            Volver al login
          </Link>

        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;