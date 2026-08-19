import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getDashboardPath, getPortalRole } from "../../utils/auth";

export default function ProtectedRoute({ allow }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (allow && !allow.includes(getPortalRole(user))) {
    return <Navigate to={getDashboardPath(user)} replace />;
  }
  return <Outlet />;
}
