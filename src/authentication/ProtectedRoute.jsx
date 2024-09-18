import React from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'universal-cookie';
import Login from '../pages/Authentication/Login';
import AccessDenied from './AccessDenied';

const ProtectedRoute = ({ children}) => {
  const cookies = new Cookies();
  const token = cookies.get('authToken');

  if (token) {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role;

    if ((userRole === 'admin') || (userRole === 'tech')) {
      return <>{children}</>; 
    } else {
      return <AccessDenied />;
    }
  } else {
    return <Login />; 
  }
};

export default ProtectedRoute;
