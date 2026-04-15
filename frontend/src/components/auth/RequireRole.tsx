import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { UserRole } from '@/src/types/domain';

interface RequireRoleProps {
  currentRole: UserRole | null;
  allowedRole: UserRole;
  children: ReactNode;
}

export default function RequireRole({ currentRole, allowedRole, children }: RequireRoleProps) {
  const location = useLocation();

  if (currentRole !== allowedRole) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return <>{children}</>;
}
