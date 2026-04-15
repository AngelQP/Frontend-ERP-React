import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { toast } from "sonner";

import { Cake, Mail} from "lucide-react";
import { Button } from "@/components/ui/button";
import { resendVerification } from "@/api/auth.api";

// Import de emailjs
import emailjs from "@emailjs/browser";

const VerifyPending = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [loading, setLoading] = useState(false);

  const sendVerificationEmail = async (
    email: string,
    verificationUrl: string,
    expirationTime: number
  ) => {
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
      console.error(error);
      return false;
    }
  };

  const handleResend = async () => {

    if (!email) {
      toast.error("No se encontró el correo");
      return;
    }

    if (loading) return;


    try {
      setLoading(true);

      const { verificationUrl, expirationTime } = await resendVerification(email);

      if (!verificationUrl) {
        toast.error("No se pudo generar el enlace");
        return;
      }

      const sent = await sendVerificationEmail(
        email,
        verificationUrl,
        expirationTime
      );

      if (sent) {
        toast.success("Correo reenviado 📩");

        setTimeout(() => {
          navigate("/login");
        }, 2000);

      } else {
        toast.error("No se pudo enviar el correo");
      }

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
            Te enviamos un enlace de verificación a <strong>{email}</strong>
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