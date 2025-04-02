
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Gallery from "./pages/userContent/Gallery";
import Location from "./pages/userContent/Location";
import Login from "./pages/adminContent/Login";
import Register from "./pages/adminContent/Register";
import ForgotPassword from "./pages/adminContent/ForgotPassword";
import ResetPassword from "./pages/adminContent/ResetPassword";
import NotFound from "./components/NotFound";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardGuests from "./pages/adminContent/DashboardGuests";
import DashboardSettings from "./pages/adminContent/DashboardSettings";
import Gift from "./pages/userContent/Gift";
import Rsvp from "./pages/userContent/Rsvp";
import Terms from "./pages/userContent/Terms";
import Privacy from "./pages/userContent/Privacy";
import Accessibility from "./pages/userContent/Accessibility";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/location" element={<Location />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/gift" element={<Gift />} />
          <Route path="/rsvp" element={<Rsvp />} />
          
          {/* Footer pages */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/accessibility" element={<Accessibility />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/guests" replace />} />
            <Route path="guests" element={<DashboardGuests />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
