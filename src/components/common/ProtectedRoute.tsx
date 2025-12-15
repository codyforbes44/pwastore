import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireDeveloper?: boolean;
}

export function ProtectedRoute({ children, requireDeveloper = false }: ProtectedRouteProps) {
  const { user, developer, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireDeveloper && !developer) {
    return <Navigate to="/become-developer" replace />;
  }

  return <>{children}</>;
}
