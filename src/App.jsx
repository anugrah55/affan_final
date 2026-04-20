import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

// Lazy loading pages for performance optimization
const Login = React.lazy(() => import('./pages/Auth/Login'));
const Signup = React.lazy(() => import('./pages/Auth/Signup'));
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const TripDetails = React.lazy(() => import('./pages/TripDetails/TripDetails'));

const FallbackLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <React.Suspense fallback={<FallbackLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes inside App Layout */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="trip/:tripId" element={<TripDetails />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
