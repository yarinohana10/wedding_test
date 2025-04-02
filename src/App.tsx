import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import DashboardLayout from './pages/adminContent/adminSection/DashboardLayout';
import NotFound from './components/NotFound';
import DashboardGuests from './pages/adminContent/adminSection/DashboardGuests';
import DashboardSettings from './pages/adminContent/adminSection/DashboardSettings';
import ForgotPassword from './pages/adminContent/auth/ForgotPassword';
import Login from './pages/adminContent/auth/Login';
import Register from './pages/adminContent/auth/Register';
import ResetPassword from './pages/adminContent/auth/ResetPassword';
import Index from './pages/Index';
import Gallery from './pages/userContent/Gallery';
import Gift from './pages/userContent/Gift';
import Accessibility from './pages/userContent/leagalContent/Accessibility';
import Privacy from './pages/userContent/leagalContent/Privacy';
import Terms from './pages/userContent/leagalContent/Terms';
import Location from './pages/userContent/Location';

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

          {/* Footer pages */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/accessibility" element={<Accessibility />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route
              index
              element={<Navigate to="/dashboard/guests" replace />}
            />
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
