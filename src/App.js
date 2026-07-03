import OwnerDashboard from './pages/OwnerDashboard';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RestaurantPage from './pages/RestaurantPage';
import CartPage from './pages/CartPage';
import MyOrdersPage from './pages/MyOrdersPage';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/restaurant/:id" element={<RestaurantPage />} />
      <Route path="/cart" element={
        <ProtectedRoute><CartPage /></ProtectedRoute>
      } />
      <Route path="/owner-dashboard" element={
  <ProtectedRoute><OwnerDashboard /></ProtectedRoute>
} />
      <Route path="/my-orders" element={
        <ProtectedRoute><MyOrdersPage /></ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;