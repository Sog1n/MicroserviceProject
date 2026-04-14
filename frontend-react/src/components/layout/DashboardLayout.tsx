import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiHome, FiUsers, FiBox, FiShoppingBag, FiLogOut, FiMenu, FiX, FiCheckSquare, FiAlertTriangle } from 'react-icons/fi';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import { toggleSidebar, toggleMobileMenu } from '@/features/ui/uiSlice';
import styles from './DashboardLayout.module.scss';
import { classNames } from '@/utils/helpers';

export default function DashboardLayout() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const { sidebarOpen, mobileMenuOpen } = useAppSelector((state) => state.ui);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const role = user?.role.toLowerCase() || '';

  const adminLinks = [
    { to: `/${role}/dashboard`, icon: <FiHome />, label: t('nav.dashboard') },
    { to: `/${role}/users`, icon: <FiUsers />, label: t('admin.userManagement') },
    { to: `/${role}/products`, icon: <FiBox />, label: 'All Products' },
    { to: `/${role}/products/moderation`, icon: <FiCheckSquare />, label: t('admin.productModeration') },
  ];

  const sellerLinks = [
    { to: `/${role}/dashboard`, icon: <FiHome />, label: t('nav.dashboard') },
    { to: `/${role}/products`, icon: <FiBox />, label: t('seller.productManagement') },
    { to: `/${role}/orders`, icon: <FiShoppingBag />, label: t('seller.orderManagement') },
  ];

  const links = role === 'admin' ? adminLinks : sellerLinks;

  return (
    <div className={styles.layout}>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className={styles.overlay} onClick={() => dispatch(toggleMobileMenu())} />
      )}

      {/* Sidebar */}
      <aside className={classNames(
        styles.sidebar,
        !sidebarOpen ? styles.collapsed : undefined,
        mobileMenuOpen ? styles.mobileOpen : undefined
      )}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.logo}>
            {sidebarOpen ? t('common.appName') : 'SV'}
          </Link>
          <button className={styles.closeMobile} onClick={() => dispatch(toggleMobileMenu())}>
            <FiX />
          </button>
        </div>

        <nav className={styles.nav}>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={classNames(
                styles.navLink,
                location.pathname === link.to ? styles.active : undefined
              )}
            >
              <span className={styles.icon}>{link.icon}</span>
              {sidebarOpen && <span className={styles.label}>{link.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={styles.mainWrapper}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuToggle} onClick={() => dispatch(toggleSidebar())}>
              <FiMenu />
            </button>
            <button className={styles.mobileMenuToggle} onClick={() => dispatch(toggleMobileMenu())}>
              <FiMenu />
            </button>
            <h2 className={styles.pageTitle}>
              {role === 'admin' ? t('admin.dashboard') : t('seller.dashboard')}
            </h2>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                {user?.fullName.charAt(0)}
              </div>
              <div className={styles.nameRole}>
                <span className={styles.name}>{user?.fullName}</span>
                <span className={styles.role}>{user?.role}</span>
              </div>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout} title={t('nav.logout')}>
              <FiLogOut />
            </button>
          </div>
        </header>

        <main className={styles.content}>
          <div className={styles.container}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
