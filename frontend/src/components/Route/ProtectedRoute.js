import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  if (!loading) {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  }
};

export default ProtectedRoute;
