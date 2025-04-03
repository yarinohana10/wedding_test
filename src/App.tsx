import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import NotFound from "./components/NotFound";
import DashboardGuests from "./pages/adminContent/adminSection/guest/DashboardGuests";
import DashboardSettings from "./pages/adminContent/adminSection/settings/DashboardSettings";
import ForgotPassword from "./pages/adminContent/auth/ForgotPassword";
import Login from "./pages/adminContent/auth/Login";
import Register from "./pages/adminContent/auth/Register";
import ResetPassword from "./pages/adminContent/auth/ResetPassword";
import Index from "./pages/Index";
import Gallery from "./pages/userContent/Gallery";
import Gift from "./pages/userContent/Gift";
import Accessibility from "./pages/userContent/leagalContent/Accessibility";
import Privacy from "./pages/userContent/leagalContent/Privacy";
import Terms from "./pages/userContent/leagalContent/Terms";
import Location from "./pages/userContent/Location";
import DashboardLayout from "./pages/adminContent/adminSection/DashboardLayout";

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
          <Route path="/gift" element={<Gift />} />

          {/* Auth pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard"  element={<DashboardLayout />}>
            <Route index element={<DashboardGuests />} />
            <Route path="settings" element={<DashboardSettings />} />
            <Route path="help" element={<NotFound />} />
          </Route>

          {/* Footer pages */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/accessibility" element={<Accessibility />} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
