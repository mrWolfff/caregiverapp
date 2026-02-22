import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ElderProfile from "./pages/ElderProfile";
import CaregiverProfile from "./pages/CaregiverProfile";
import CreateCareRequest from "./pages/CreateCareRequest";
import CareRequests from "./pages/CareRequests";
import CareRequestDetail from "./pages/CareRequestDetail";
import MyRequests from "./pages/MyRequests";
import Education from "./pages/Education";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/elder/profile"
              element={
                <ProtectedRoute allowedRoles={['ELDER']}>
                  <ElderProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/caregiver/profile"
              element={
                <ProtectedRoute allowedRoles={['CAREGIVER']}>
                  <CaregiverProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/care-requests/new"
              element={
                <ProtectedRoute allowedRoles={['ELDER']}>
                  <CreateCareRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/care-requests"
              element={
                <ProtectedRoute>
                  <CareRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/care-requests/:id"
              element={
                <ProtectedRoute>
                  <CareRequestDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-requests"
              element={
                <ProtectedRoute allowedRoles={['ELDER']}>
                  <MyRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/education"
              element={
                <ProtectedRoute allowedRoles={['CAREGIVER']}>
                  <Education />
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
