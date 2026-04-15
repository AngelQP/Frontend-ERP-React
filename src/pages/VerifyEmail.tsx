import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Cake, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/api/auth.api";

type Status = "loading" | "success" | "error";

const VerifyEmail = () => {

  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<Status>("loading");
  const [hasVerified, setHasVerified] = useState(false);

  useEffect(() => {

    if (!token) {
      setStatus("error");
      toast.error("Token inválido");
      return;
    }

    if (hasVerified) return;

    setHasVerified(true);

    const verify = async () => {
      try {
        await verifyEmail(token);

        setStatus("success");
        toast.success("Correo verificado correctamente 🎉");

        setTimeout(() => navigate("/login"), 3000);

      } catch (error: any) {
        setStatus("error");

        const message =
          error?.response?.data?.message || "Error al verificar correo";

        toast.error(message);

        setTimeout(() => navigate("/"), 2500);
      }
    };

    verify();
  }, [token, navigate, hasVerified]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">

      <div className="w-full max-w-md text-center animate-fade-in">

        {/* Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-6 shadow-lg">
          <Cake className="w-8 h-8 text-primary-foreground" />
        </div>

        {/* Card */}
        <div className="card-elevated p-8 animate-scale-in">

          {/* ICONO ESTADO */}
          <div className="mb-6 flex justify-center">
            {status === "loading" && (
              <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
            )}

            {status === "success" && (
              <div className="w-14 h-14 rounded-xl bg-success-light flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
            )}

            {status === "error" && (
              <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
            )}
          </div>

          {/* TEXTO */}
          {status === "loading" && (
            <>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Verificando tu correo...
              </h2>
              <p className="text-sm text-muted-foreground">
                Esto tomará solo unos segundos
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                ¡Correo verificado!
              </h2>
              <p className="text-sm text-muted-foreground">
                Ya puedes iniciar sesión en tu cuenta
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                No se pudo verificar
              </h2>
              <p className="text-sm text-muted-foreground">
                El enlace es inválido o ha expirado
              </p>
            </>
          )}

          {/* BOTÓN */}
          {status !== "loading" && (
            <Button
              className="w-full mt-6"
              onClick={() => navigate("/login")}
            >
              Ir al login
            </Button>
          )}

          {/* Cuando hay error que haya reintento */}
          {status === "error" && (
          <Button
            variant="outline"
            className="w-full mt-3"
            onClick={() => {
              setStatus("loading");
              setHasVerified(false);
            }}
          >
            Reintentar
          </Button>
        )}

        </div>

      </div>
    </div>
  );
};

export default VerifyEmail;