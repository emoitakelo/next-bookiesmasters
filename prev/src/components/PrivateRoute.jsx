import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// This component protects any route it wraps
const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  // If token exists, render the child route(s); otherwise redirect to login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
