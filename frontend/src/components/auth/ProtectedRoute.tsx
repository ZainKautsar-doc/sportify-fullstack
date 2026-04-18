import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { UserRole } from '@/src/types/domain';
import { isAuthenticated } from '@/src/lib/storage';

interface ProtectedRouteProps {
  currentRole?: UserRole | null;
  allowedRole?: UserRole;
  children: ReactNode;
}

/**
 * Route guard that requires authentication.
 * If user is not logged in, redirects to login.
 * If allowedRole is specified and user role doesn't match, redirects.
 */
export default function ProtectedRoute({ currentRole, allowedRole, children }: ProtectedRouteProps) {
  const location = useLocation();

  if (!isAuthenticated()) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  if (allowedRole && currentRole && currentRole !== allowedRole) {
    // If logged in but wrong role (e.g. user trying to access admin)
    return <Navigate to={currentRole === 'admin' ? '/admin' : '/'} replace />;
  }

  return <>{children}</>;
}
