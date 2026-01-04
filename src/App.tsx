import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GhostVault from "./pages/GhostVault";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import GhostSubmission from "./pages/GhostSubmission";
import Login from "./pages/Login";
import SeniorDashboard from './pages/SeniorDashboard';
import AuthGuard from "@/components/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vault" element={<GhostVault />} />
          <Route path="/ghost-vault" element={<GhostVault />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/ghost-submission" element={
            <AuthGuard>
              <GhostSubmission />
            </AuthGuard>
          } />
          <Route path="/senior-dashboard" element={
            <AuthGuard>
              <SeniorDashboard />
            </AuthGuard>
          } />
          <Route path="/login" element={<Login />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;