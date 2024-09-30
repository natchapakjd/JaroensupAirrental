import React from 'react';
import { useLocation } from 'react-router-dom';
import Login from '../pages/Authentication/Login';
import AccessDenied from './AccessDenied';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const user = useAuth();
  const location = useLocation(); // Get current location

  if (user) {
    try {
      const userRole = user.user.role;

      if (userRole === 3 || userRole === 2) {
        return <>{children}</>;
      } else if (userRole === 1) {
        if (!location.pathname.startsWith('/dashboard')) {
          return <>{children}</>;
        } else {
          return <AccessDenied />;
        }
      } else {
        return <AccessDenied />;
      }
    } catch (error) {
      console.error('Token decoding failed:', error);
      return <AccessDenied />;
    }
  } else {
    return <Login />;
  }
};

export default ProtectedRoute;
