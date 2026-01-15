import { Button } from "@/components/ui/button";
import { Cake, ArrowRight, BarChart3, Package, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 rounded-full bg-secondary/5 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-12 lg:py-24">
          <div className="text-center animate-fade-in">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-6 shadow-lg animate-scale-in">
              <Cake className="w-10 h-10 text-primary-foreground" />
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-4">
              Dulce Control
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              El ERP perfecto para tu emprendimiento de pastelería. Simple, visual y todo lo que necesitas para hacer crecer tu negocio.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                size="xl"
                className="gap-2"
                onClick={() => navigate("/register")}
              >
                Comenzar gratis
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                size="xl"
                variant="outline"
                onClick={() => navigate("/login")}
              >
                Iniciar sesión
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="card-elevated p-6 text-center hover-lift animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="w-14 h-14 rounded-xl bg-primary-light mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Dashboard visual</h3>
              <p className="text-muted-foreground text-sm">
                Ve tus ingresos, gastos y balance de un vistazo con gráficas claras.
              </p>
            </div>

            <div className="card-elevated p-6 text-center hover-lift animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="w-14 h-14 rounded-xl bg-secondary-light mx-auto mb-4 flex items-center justify-center">
                <Package className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Control de insumos</h3>
              <p className="text-muted-foreground text-sm">
                Gestiona tus ingredientes, costos y stock de forma simple.
              </p>
            </div>

            <div className="card-elevated p-6 text-center hover-lift animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="w-14 h-14 rounded-xl bg-success-light mx-auto mb-4 flex items-center justify-center">
                <ShoppingCart className="w-7 h-7 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Registro de ventas</h3>
              <p className="text-muted-foreground text-sm">
                Registra ventas en segundos y lleva el control de tu negocio.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Dulce Control. Hecho con 💜 para emprendedores de pastelería.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
