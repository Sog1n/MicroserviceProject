import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

export default function AuthGuard() {
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!user || !accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
