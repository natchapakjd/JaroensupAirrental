import React from 'react';
import { useLocation } from 'react-router-dom';
import Login from '../pages/Authentication/Login';
import AccessDenied from './AccessDenied';
import Cookies from 'universal-cookie';
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const cookies = new Cookies();
  const token = cookies.get("authToken");

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

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
    // If no token is found, redirect to login
    return <Login />;
  }
};

export default ProtectedRoute;
