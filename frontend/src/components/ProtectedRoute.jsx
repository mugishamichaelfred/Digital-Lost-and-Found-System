import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthoContext";

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireUser = false,
}) => {
  const { isAuthenticated, isAdmin, isUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/userdash" replace />;
  }

  if (requireUser && !isUser) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
