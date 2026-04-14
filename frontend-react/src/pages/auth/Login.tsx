import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loginAsync, clearError } from '@/features/auth/authSlice';
import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Input/Input';
import Card from '@/components/common/Card/Card';
import styles from './Auth.module.scss';
import { FiAlertCircle } from 'react-icons/fi';

export default function Login() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({ username: '', password: '' });

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) dispatch(clearError());
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(loginAsync(form));
    
    if (loginAsync.fulfilled.match(resultAction)) {
      const user = resultAction.payload.user;
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'SELLER') {
        navigate('/seller/dashboard');
      } else {
        navigate(from === '/login' ? '/' : from);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('auth.loginTitle')}</h1>
          <p className={styles.subtitle}>{t('auth.loginSubtitle')}</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label={t('auth.username')}
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />
          <Input
            label={t('auth.password')}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />

          <Button type="submit" fullWidth size="lg" loading={loading} className={styles.submitBtn}>
            {t('auth.loginButton')}
          </Button>
        </form>

        <p className={styles.footer}>
          {t('auth.noAccount')}{' '}
          <Link to="/register" className={styles.link}>
            {t('auth.registerLink')}
          </Link>
        </p>
      </Card>
    </div>
  );
}
