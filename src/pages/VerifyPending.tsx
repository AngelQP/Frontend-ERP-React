import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { toast } from "sonner";

import { Cake, Mail} from "lucide-react";
import { Button } from "@/components/ui/button";
import { resendVerification } from "@/api/auth.api";

const VerifyPending = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error("No se encontró el correo");
      return;
    }

    try {
      setLoading(true);

      console.log("EMAIL:", email);

      await resendVerification(email);

      toast.success("Correo reenviado 📩");

    } catch (error: any) {

        console.log(error.response?.data);
        const message =
            error?.response?.data?.message || "Error al reenviar";

        toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">

      <div className="w-full max-w-md text-center animate-fade-in">

        {/* Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-6 shadow-lg">
          <Cake className="w-8 h-8 text-primary-foreground" />
        </div>

        <div className="card-elevated p-8 animate-scale-in">

          {/* Icon */}
          <div className="w-14 h-14 rounded-xl bg-secondary-light mx-auto mb-6 flex items-center justify-center">
            <Mail className="w-8 h-8 text-secondary" />
          </div>

          <h2 className="text-lg font-semibold text-foreground mb-2">
            Verifica tu correo
          </h2>

          <p className="text-sm text-muted-foreground mb-6">
            Te enviamos un enlace de verificación.
            <br />
            Si no lo recibiste, puedes reenviarlo.
          </p>

          {/* BOTÓN */}
          <Button
            className="w-full"
            onClick={handleResend}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Reenviar correo"}
          </Button>

          {/* VOLVER */}
          <Button
            variant="ghost"
            className="w-full mt-3"
            onClick={() => navigate("/login")}
          >
            Volver al login
          </Button>

        </div>

      </div>
    </div>
  );
};

export default VerifyPending;