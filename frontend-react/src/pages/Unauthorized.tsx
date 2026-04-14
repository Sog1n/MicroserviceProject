import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button/Button';
import styles from './Unauthorized.module.scss';
import { FiShieldOff } from 'react-icons/fi';

export default function Unauthorized() {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.icon}><FiShieldOff /></div>
      <h1 className={styles.title}>403</h1>
      <p className={styles.message}>{t('errors.unauthorized')}</p>
      <div className={styles.actions}>
        <Link to="/"><Button>{t('errors.goHome')}</Button></Link>
        <Link to={-1 as unknown as string}><Button variant="outline">{t('errors.goBack')}</Button></Link>
      </div>
    </div>
  );
}
