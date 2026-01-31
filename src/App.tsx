import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Insumos from "./pages/Insumos";
import Postres from "./pages/Postres";
import Ventas from "./pages/Ventas";
import NotFound from "./pages/NotFound";

import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from "./context/AuthContext";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/** Rutas protegidas */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/** Rutas protegidas */}
            <Route path="/dashboard" element={ <ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/insumos" element={ <ProtectedRoute><Insumos /></ProtectedRoute>} />
            <Route path="/postres" element={ <ProtectedRoute><Postres /></ProtectedRoute>} />
            <Route path="/ventas" element={ <ProtectedRoute><Ventas /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
