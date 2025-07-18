import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; 
import type { JSX } from 'react';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { token, roles } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    (!Array.isArray(roles) || !roles.some(role => allowedRoles.includes(role)))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
