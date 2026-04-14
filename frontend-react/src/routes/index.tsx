import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import Spinner from '@/components/common/Spinner/Spinner';

// ── Lazy-loaded Pages ─────────────────────────────────────────────
// Public
const Home = lazy(() => import('@/pages/public/Home'));
const ProductList = lazy(() => import('@/pages/public/ProductList'));
const ProductDetail = lazy(() => import('@/pages/public/ProductDetail'));
const Cart = lazy(() => import('@/pages/public/Cart'));
const Checkout = lazy(() => import('@/pages/public/Checkout'));

// Auth
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));

// User
const UserProfile = lazy(() => import('@/pages/user/UserProfile'));
const UserOrders = lazy(() => import('@/pages/user/UserOrders'));
const UserOrderDetail = lazy(() => import('@/pages/user/UserOrderDetail'));

// Admin
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'));
const AdminProductModeration = lazy(() => import('@/pages/admin/AdminProductModeration'));
const AdminProfile = lazy(() => import('@/pages/admin/AdminProfile'));

// Seller
const SellerDashboard = lazy(() => import('@/pages/seller/SellerDashboard'));
const SellerProducts = lazy(() => import('@/pages/seller/SellerProducts'));
const SellerOrders = lazy(() => import('@/pages/seller/SellerOrders'));
const SellerProfile = lazy(() => import('@/pages/seller/SellerProfile'));

// Misc
const Unauthorized = lazy(() => import('@/pages/Unauthorized'));

// ── Router Configuration ──────────────────────────────────────────
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Public routes
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'products', element: <ProductList /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'cart', element: <Cart /> },

      // USER protected routes
      {
        element: <AuthGuard />,
        children: [
          { path: 'checkout', element: <Checkout /> },
          { path: 'user/profile', element: <UserProfile /> },
          { path: 'user/orders', element: <UserOrders /> },
          { path: 'user/orders/:id', element: <UserOrderDetail /> },
        ],
      },

      // Unauthorized page
      { path: 'unauthorized', element: <Unauthorized /> },
    ],
  },

  // ADMIN Protected Routes (Dashboard layout)
  {
    path: '/admin',
    element: <RoleGuard allowedRoles={['ADMIN']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'products', element: <AdminProducts /> },
          { path: 'products/moderation', element: <AdminProductModeration /> },
          { path: 'profile', element: <AdminProfile /> },
        ],
      },
    ],
  },

  // SELLER Protected Routes (Dashboard layout)
  {
    path: '/seller',
    element: <RoleGuard allowedRoles={['SELLER']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: 'dashboard', element: <SellerDashboard /> },
          { path: 'products', element: <SellerProducts /> },
          { path: 'orders', element: <SellerOrders /> },
          { path: 'profile', element: <SellerProfile /> },
        ],
      },
    ],
  },

  // Catch-all 404
  {
    path: '*',
    element: <MainLayout />,
    children: [
      { index: true, element: <Unauthorized /> },
    ],
  },
]);

export default function AppRouter() {
  return (
    <Suspense fallback={<Spinner size="lg" />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
