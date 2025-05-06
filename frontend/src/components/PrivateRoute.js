import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // If role is specified, check if user has that role
  if (role && user.role !== role) {
    // Redirect to appropriate dashboard based on user's role
    return <Navigate to={`/${user.role}-dashboard`} replace />;
  }

  return children;
};

export default PrivateRoute; 