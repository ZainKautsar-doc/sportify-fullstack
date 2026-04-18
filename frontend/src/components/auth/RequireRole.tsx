import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { UserRole } from '@/src/types/domain';

interface RequireRoleProps {
  currentRole: UserRole | null;
  allowedRole: UserRole;
  children: ReactNode;
}

/**
 * Route guard that requires a specific role.
 * If user is not logged in or has wrong role, redirects to login.
 */
export default function RequireRole({ currentRole, allowedRole, children }: RequireRoleProps) {
  const location = useLocation();

  if (!currentRole) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  if (currentRole !== allowedRole) {
    // If logged in but wrong role (e.g. user trying to access admin)
    return <Navigate to={currentRole === 'admin' ? '/admin' : '/'} replace />;
  }

  return <>{children}</>;
}
