import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button/Button';
import styles from './Home.module.scss';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw } from 'react-icons/fi';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t('home.hero')}</h1>
          <p className={styles.heroSubtitle}>{t('home.heroSubtitle')}</p>
          <Link to="/products">
            <Button size="lg" icon={<FiArrowRight />} className={styles.ctaBtn}>
              {t('home.shopNow')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}><FiTruck /></div>
          <h3>Free Shipping</h3>
          <p>On all orders over $100</p>
        </div>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}><FiShield /></div>
          <h3>Secure Payment</h3>
          <p>100% secure checkout</p>
        </div>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}><FiRefreshCw /></div>
          <h3>Easy Returns</h3>
          <p>30 days return policy</p>
        </div>
      </section>
    </div>
  );
}
