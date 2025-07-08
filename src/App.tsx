import React, { useEffect, useState, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Nvigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VehicleRegistration from './pages/VehicleRegistration';
import VehicleSearch from './pages/VehicleSearch';
import VehicleDetails from './pages/VehicleDetails';
import TransactionHistory from './pages/TransactionHistory';
import OwnershipTransfer from './pages/OwnershipTransfer';
import AdminDashboard from './pages/AdminDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import NotFound from './pages/NotFound';
// Components
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
export function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  if (isLoading) {
    return <LoadingScreen />;
  }
  return <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>
              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="register-vehicle" element={<VehicleRegistration />} />
                <Route path="search" element={<VehicleSearch />} />
                <Route path="vehicle/:id" element={<VehicleDetails />} />
                <Route path="transactions" element={<TransactionHistory />} />
                <Route path="transfer" element={<OwnershipTransfer />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="officer" element={<OfficerDashboard />} />
              </Route>
              {/* 404 and redirects */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Router>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>;
}
