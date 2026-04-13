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
import Preparaciones from "./pages/Preparaciones";

import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from "./context/AuthContext";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyPending from "./pages/VerifyPending";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/** Rutas sin proteger */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/verify-pending" element={<VerifyPending />} />            

            {/** Rutas protegidas */}
            <Route path="/dashboard" element={ <ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/insumos" element={ <ProtectedRoute><Insumos /></ProtectedRoute>} />
            <Route path="/postres" element={ <ProtectedRoute><Postres /></ProtectedRoute>} />
            <Route path="/ventas" element={ <ProtectedRoute><Ventas /></ProtectedRoute>} />
            <Route path="/preparaciones" element={ <ProtectedRoute><Preparaciones /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
