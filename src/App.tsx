import React, { useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { initDarkMode } from './utils/darkMode';
import { UserRole } from './types/user';

// Import pages
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import VehicleDetails from './pages/VehicleDetails';
import Customers from './pages/Customers';
import Users from './pages/Users';
import Settings from './pages/Settings';

// Import layout
import AppLayout from './components/layout/AppLayout';

// Protected Route Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode, 
  adminOnly?: boolean
}> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  // Show nothing while checking auth state
  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && role.toLowerCase() !== UserRole.ADMIN.toLowerCase()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

// Public Route Component
const PublicRoute: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show nothing while checking auth state
  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  useEffect(() => {
    initDarkMode();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
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
            path="/vehicles" 
            element={
              <ProtectedRoute>
                <Vehicles />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vehicles/:id" 
            element={
              <ProtectedRoute>
                <VehicleDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customers" 
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute adminOnly>
                <Users />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
