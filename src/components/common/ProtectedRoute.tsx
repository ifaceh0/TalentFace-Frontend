import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

interface Props {
  allowedRoles?: Array<'admin' | 'recruiter' | 'joinee'>;
}

/**
 * Wraps private routes.
 * - Shows nothing while the session is being restored (loading = true).
 * - Redirects unauthenticated users to /login.
 * - Redirects users whose role is not in allowedRoles to /unauthorized.
 */
export default function ProtectedRoute({ allowedRoles }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <svg
          className="animate-spin w-10 h-10 text-[#F43F5E]"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
