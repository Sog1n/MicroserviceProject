import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

interface RoleGuardProps {
  allowedRoles: ('USER' | 'ADMIN' | 'SELLER')[];
}

export default function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
