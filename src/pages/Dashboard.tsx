import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import {
  // DollarSign,
  BanknoteArrowUp,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Cake,
  Package,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { useDashboard } from "@/hooks/useDashboard";

// const salesData = [
//   { name: "Ene", ventas: 1100, gastos: 500 },
//   { name: "Feb", ventas: 1600, gastos: 800 },
//   { name: "Mar", ventas: 5100, gastos: 2800 },
//   { name: "Abr", ventas: 4700, gastos: 2500 },
//   { name: "May", ventas: 5800, gastos: 3200 },
//   { name: "Jun", ventas: 6200, gastos: 3100 },
//   { name: "Jul", ventas: 6800, gastos: 3500 },
//   { name: "Ago", ventas: 7200, gastos: 3800 },
//   { name: "Sep", ventas: 7800, gastos: 4200 },
//   { name: "Oct", ventas: 8500, gastos: 4500 },
//   { name: "Nov", ventas: 9000, gastos: 4800 },
//   { name: "Dic", ventas: 9500, gastos: 5000 },
// ];

// const topProducts = [
//   { name: "Pastel de Chocolate", ventas: 45 },
//   { name: "Cheesecake", ventas: 38 },
//   { name: "Cupcakes", ventas: 32 },
//   { name: "Brownie", ventas: 28 },
//   { name: "Galletas", ventas: 24 },
// ];

// const recentSales = [
//   { id: 1, product: "Pastel de Chocolate", quantity: 1, total: 450, time: "Hace 2h" },
//   { id: 2, product: "Cupcakes (12)", quantity: 2, total: 180, time: "Hace 4h" },
//   { id: 3, product: "Cheesecake", quantity: 1, total: 380, time: "Hace 6h" },
//   { id: 4, product: "Brownie (6)", quantity: 3, total: 270, time: "Ayer" },
// ];

const Dashboard = () => {

  const {
    stats,
    chart,
    topProductos,
    ventasRecientes,
    inventario,
    ingresosChange,
    gastosChange
  } = useDashboard();



  return (
    <AppLayout title="Dashboard" subtitle="Resumen de tu negocio">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Ingresos del mes"
          // value="S/. 6,200"
          value={`S/. ${stats?.ingresosMes ?? 0}`}
          // change="+12% vs mes anterior"
          change={`${ingresosChange.toFixed(1)}% vs mes anterior`}
          changeType="positive"
          icon={BanknoteArrowUp}
          variant="success"
        />
        <StatCard
          title="Gastos del mes"
          // value="s/. 3,100"
          value={`S/. ${stats?.gastosMes ?? 0}`}
          // change="+3% vs mes anterior"
          change={`${gastosChange.toFixed(1)}% vs mes anterior`}
          changeType="negative"
          icon={TrendingDown}
          variant="warning"
        />
        <StatCard
          title="Balance"
          // value="S/. 3,100"
          value={`S/. ${stats?.balance ?? 0}`}
          change="Utilidad neta"
          changeType="positive"
          icon={TrendingUp}
          variant="primary"
        />
        <StatCard
          title="Ventas realizadas"
          // value="42"
          // change="+8 esta semana"
          value={`${stats?.ventasMes ?? 0}`}
          change={`${stats?.ventasSemana ?? 0} esta semana`}
          changeType="positive"
          icon={ShoppingBag}
          variant="secondary"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 card-elevated p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Ingresos vs Gastos
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              {/* <AreaChart data={salesData}> */}
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(270, 50%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(270, 50%, 60%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(200, 70%, 55%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(200, 70%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 90%)" />
                <XAxis dataKey="name" stroke="hsl(240, 5%, 50%)" fontSize={12} />
                <YAxis stroke="hsl(240, 5%, 50%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(240, 10%, 90%)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke="hsl(270, 50%, 60%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVentas)"
                  name="Ventas"
                />
                <Area
                  type="monotone"
                  dataKey="gastos"
                  stroke="hsl(200, 70%, 55%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorGastos)"
                  name="Gastos"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="card-elevated p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Postres más vendidos
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              {/* <BarChart data={topProducts} layout="vertical"> */}
              <BarChart data={topProductos} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 90%)" />
                <XAxis type="number" stroke="hsl(240, 5%, 50%)" fontSize={12} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="hsl(240, 5%, 50%)"
                  fontSize={11}
                  width={100}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(240, 10%, 90%)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="ventas"
                  fill="hsl(270, 50%, 60%)"
                  radius={[0, 4, 4, 0]}
                  name="Unidades"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Sales */}
        <div className="card-elevated p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Ventas recientes
          </h3>
          <div className="space-y-3">
            {/* {recentSales.map((sale) => ( */}
            {ventasRecientes.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                    <Cake className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{sale.product}</p>
                    <p className="text-xs text-muted-foreground">
                      x{sale.quantity} • {sale.time}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-foreground">S/. {sale.total}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card-elevated p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Inventario rápido
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-success-light">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-success" />
                <span className="text-sm font-medium text-foreground">Insumos disponibles</span>
              </div>
              {/* <span className="text-lg font-bold text-success">24</span> */}
              <span className="text-lg font-bold text-success">{inventario?.insumosDisponibles ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-warning-light">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-warning" />
                <span className="text-sm font-medium text-foreground">Stock bajo</span>
              </div>
              <span className="text-lg font-bold text-warning">{inventario?.stockBajo ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary-light">
              <div className="flex items-center gap-3">
                <Cake className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Postres activos</span>
              </div>
              <span className="text-lg font-bold text-primary">{inventario?.postresActivos ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary-light">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-secondary" />
                <span className="text-sm font-medium text-foreground">Ventas hoy</span>
              </div>
              <span className="text-lg font-bold text-secondary">{inventario?.ventasHoy ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
