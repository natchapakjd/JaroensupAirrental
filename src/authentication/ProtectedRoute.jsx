import React from "react";
import Login from "../pages/Login";
import { jwtDecode } from "jwt-decode";
import AccessDenied from "./AccessDenied";
import Cookies from "universal-cookie";

const ProtectedRoute = (props, c ) => {
  const cookies = new Cookies();
  const token = cookies.get("authToken");

  if (token) {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role;
    
    if (userRole === "admin" && flag === 0 ) {
      return <div>{props}</div>;
    } 
    else if (userRole === "tech" && flag=== 1) {
      return <div><h1>{props}</h1></div>;
    }
    else if (userRole === "client") {
      return <AccessDenied />;
    }
    else {
      return <AccessDenied />;
    }
  } else {
    return  <Login />;
  }
};

export default ProtectedRoute;