import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export const RequireAuth: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname, message: 'Silakan login terlebih dahulu' }} replace />;
  }
  return <>{children}</>;
};

export const RequireRole: React.FC<{ role: Role; children: ReactNode }> = ({ role, children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.role !== role) {
    // Redirect to their appropriate dashboard
    const target = user.role === Role.ADMIN ? '/admin/dashboard' : '/member/dashboard';
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
