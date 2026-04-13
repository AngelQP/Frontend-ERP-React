  import { useState } from "react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Cake, Mail, Lock } from "lucide-react";
  import { useNavigate, Link } from "react-router-dom";

  // importar usetoast
  import { useToast } from "@/components/ui/use-toast";

  // import de consumo de api
  import { loginUser } from "@/api/auth.api";
  import { useAuth } from "@/context/AuthContext";

  // import de login de AuthContext


  const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();

    // inicio de toast
    const { toast } = useToast();

    const validate = () => {
      const newErrors: { email?: string; password?: string } = {};
      if (!email.trim()) newErrors.email = "Correo requerido";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Correo inválido";
      }
      if (!password) newErrors.password = "Contraseña requerida";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if ( !validate() ) return;

      setErrors({});
      try {
        setIsLoading(true);

        // console.log("Usuario :", { email, password });

        // Enviando datos del formulario
        const response = await loginUser({ email, password });

        console.log(response.token)

        // llamar a la función login del contexto de autenticación
        login(response.token);

        // almacenar en localStorage o manejar el token según sea necesario
        // localStorage.setItem("token", response.token);

        // Toast de bienvenida
        toast({
          title: "¡Bienvenido!",
          description: `Hola ${response.name}, que tengas un gran día 🍰`,
          duration: 3000,
        });

        // redirigir al dashboard u otra página
        navigate("/dashboard");

      }catch (error: any) {

        console.log(error.response?.data);
        
        const message = error.response?.data?.message;

        // CASO: EMAIL NO VERIFICADO
        if (message?.includes("verificar")) {

          toast({
            title: "Verifica tu correo",
            description: "Debes verificar tu cuenta antes de iniciar sesión",
            variant: "destructive",
          });

          // REDIRECCIÓN CON EMAIL
          navigate("/verify-pending", { state: { email } });

          return;
        }

        // CREDENCIALES
        if (error.response?.status === 401) {
          toast({
            title: "Credenciales incorrectas",
            description: "Verifica tu correo o contraseña",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error inesperado",
            description: "Inténtalo nuevamente más tarde",
            variant: "destructive",
          });
        }   

      } finally {
        setIsLoading(false);
      }
      
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8 animate-fade-in">
            <Link to="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 shadow-lg">
              <Cake className="w-8 h-8 text-primary-foreground" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Dulce Control</h1>
            <p className="text-muted-foreground mt-1">Ingresa a tu cuenta</p>
          </div>

          {/* Form Card */}
          <div className="card-elevated p-8 animate-scale-in">
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive animate-fade-in">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.password && <p className="text-xs text-destructive animate-fade-in">{errors.password}</p>}
              </div>
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </form>

          </div>

          {/* Register Link */}
          <p className="text-center mt-6 text-sm text-muted-foreground animate-fade-in">
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-primary font-medium hover:underline transition-colors"
            >
              Regístrate gratis
            </button>
          </p>
        </div>
      </div>
    );
  };

  export default Login;
