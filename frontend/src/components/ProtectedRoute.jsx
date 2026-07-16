import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

/**
 * Guards routes based on authentication and optional role list.
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}> ... </Route>
 *   <Route element={<ProtectedRoute roles={['admin']} />}> ... </Route>
 */
export default function ProtectedRoute({ roles, children }) {
  const { ready, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!ready) {
    // Minimal splash while we hydrate. Keeps design system neutral.
    return (
      <div
        data-testid="auth-loading"
        className="min-h-[60vh] flex items-center justify-center bg-[#FBF6EE]"
      >
        <div className="flex items-center gap-3 text-[#4a4a44]">
          <div className="w-4 h-4 rounded-full border-2 border-[#EF6A3D] border-t-transparent animate-spin" />
          <span className="text-[13px] uppercase tracking-[0.16em]">Loading</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children ?? <Outlet />;
}
