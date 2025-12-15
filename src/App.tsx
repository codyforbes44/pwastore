import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Browse from "./pages/Browse";
import Search from "./pages/Search";
import AppDetail from "./pages/AppDetail";
import Categories from "./pages/Categories";
import CategoryApps from "./pages/CategoryApps";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import BecomeDeveloper from "./pages/BecomeDeveloper";
import Dashboard from "./pages/developer/Dashboard";
import SubmitApp from "./pages/developer/SubmitApp";
import PublicProfile from "./pages/developer/PublicProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/search" element={<Search />} />
            <Route path="/app/:slug" element={<AppDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:slug" element={<CategoryApps />} />
            <Route path="/developer/:id" element={<PublicProfile />} />
            <Route path="/become-developer" element={<BecomeDeveloper />} />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/developer/dashboard"
              element={
                <ProtectedRoute requireDeveloper>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/developer/submit"
              element={
                <ProtectedRoute requireDeveloper>
                  <SubmitApp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/developer/edit/:id"
              element={
                <ProtectedRoute requireDeveloper>
                  <SubmitApp />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
