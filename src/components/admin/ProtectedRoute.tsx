// components/ProtectedRoute.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loadingSession, loadingAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // redirect only when we explicitly know user is NOT admin
    if (!loadingSession && !loadingAdmin && isAdmin === false) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAdmin, loadingSession, loadingAdmin, navigate]);

  // show spinner while either session rehydration or admin check is in progress
  if (loadingSession || loadingAdmin || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-purple"></div>
      </div>
    );
  }

  if (!isAdmin) return null;
  return <>{children}</>;
};

export default ProtectedRoute;
