import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cake, Lock } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useToast } from "@/components/ui/use-toast";

const ResetPassword = () => {

  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);

  // bloquear acceso si no hay token
  useEffect(() => {

    if (!token) {

      toast({
        title: "Acceso inválido",
        description: "No tienes permiso para acceder a esta página",
        variant: "destructive",
      });

      navigate("/login");
    }

  }, [token, navigate, toast]);

  const validate = () => {

    const newErrors: {
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!password) {
      newErrors.password = "Contraseña requerida";
    } else if (password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirmar contraseña";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!validate()) return;

    try {

      setIsLoading(true);

      console.log("Token:", token);
      console.log("Nueva contraseña:", password);

      // aquí irá la API
      // await resetPassword({ token, password })

      toast({
        title: "Contraseña actualizada",
        description: "Ya puedes iniciar sesión",
        duration: 3000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {

      toast({
        title: "Error",
        description: "El enlace ya no es válido o expiró",
        variant: "destructive",
      });

      navigate("/login");

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
            Nueva contraseña
          </h1>

          <p className="text-muted-foreground mt-1">
            Ingresa tu nueva contraseña
          </p>

        </div>

        {/* Card */}
        <div className="card-elevated p-8 animate-scale-in">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* password */}
            <div className="space-y-2">

              <Label htmlFor="password">
                Nueva contraseña
              </Label>

              <div className="relative">

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                />

              </div>

              {errors.password && (
                <p className="text-xs text-destructive animate-fade-in">
                  {errors.password}
                </p>
              )}

            </div>

            {/* confirm password */}
            <div className="space-y-2">

              <Label htmlFor="confirmPassword">
                Confirmar contraseña
              </Label>

              <div className="relative">

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                  }}
                  className={`pl-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                />

              </div>

              {errors.confirmPassword && (
                <p className="text-xs text-destructive animate-fade-in">
                  {errors.confirmPassword}
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
                "Cambiar contraseña"
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

export default ResetPassword;