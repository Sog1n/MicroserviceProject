import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiShoppingCart, FiUser, FiLogOut, FiGlobe } from 'react-icons/fi';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import styles from './MainLayout.module.scss';
import { classNames } from '@/utils/helpers';

export default function MainLayout() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);

  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={classNames('container', styles.headerContent)}>
          <Link to="/" className={styles.logo}>
            {t('common.appName')}
          </Link>

          <nav className={styles.nav}>
            <Link to="/products" className={styles.navLink}>{t('nav.products')}</Link>
            
            <button className={styles.iconBtn} onClick={toggleLanguage} title={t('nav.language')}>
              <FiGlobe />
              <span className={styles.langText}>{i18n.language.toUpperCase()}</span>
            </button>

            <Link to="/cart" className={styles.cartBtn}>
              <FiShoppingCart />
              {cartItemsCount > 0 && <span className={styles.badge}>{cartItemsCount}</span>}
            </Link>

            {user ? (
              <div className={styles.userMenu}>
                <Link to={`/${user.role.toLowerCase()}/profile`} className={styles.navLink}>
                  <FiUser /> {user.fullName}
                </Link>
                <Link to="/user/orders" className={styles.navLink}>
                  <FiShoppingCart /> {t('nav.orders') || 'My Orders'}
                </Link>
                {user.role !== 'USER' && (
                  <Link to={`/${user.role.toLowerCase()}/dashboard`} className={styles.navLink}>
                    {t('nav.dashboard')}
                  </Link>
                )}
                <button className={styles.iconBtn} onClick={handleLogout} title={t('nav.logout')}>
                  <FiLogOut />
                </button>
              </div>
            ) : (
              <div className={styles.authLinks}>
                <Link to="/login" className={styles.navLink}>{t('nav.login')}</Link>
                <Link to="/register" className={styles.registerBtn}>{t('nav.register')}</Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className={classNames('container', styles.main)}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} {t('common.appName')}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
