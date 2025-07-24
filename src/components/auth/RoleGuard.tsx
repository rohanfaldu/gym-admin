import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  roles: string[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};