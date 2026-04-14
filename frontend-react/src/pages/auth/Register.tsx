import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { registerAsync, clearError } from '@/features/auth/authSlice';
import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Input/Input';
import Card from '@/components/common/Card/Card';
import styles from './Auth.module.scss';
import { FiAlertCircle } from 'react-icons/fi';

export default function Register() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) dispatch(clearError());
    if (validationError) setValidationError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    const { confirmPassword, ...payload } = form;
    const resultAction = await dispatch(registerAsync(payload));
    
    if (registerAsync.fulfilled.match(resultAction)) {
      navigate('/');
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('auth.registerTitle')}</h1>
          <p className={styles.subtitle}>{t('auth.registerSubtitle')}</p>
        </div>

        {(error || validationError) && (
          <div className={styles.errorAlert}>
            <FiAlertCircle />
            <span>{error || validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input label={t('auth.username')} name="username" value={form.username} onChange={handleChange} required />
          <Input label={t('auth.email')} name="email" type="email" value={form.email} onChange={handleChange} required />
          <Input label={t('auth.fullName')} name="fullName" value={form.fullName} onChange={handleChange} required />
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#2d3436' }}>
              Account Type
            </label>
            <select 
              value={form.role} 
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dfe6e9', background: '#f8f9fa', fontSize: '15px', color: '#2d3436', cursor: 'pointer', outline: 'none' }}
            >
              <option value="USER">Customer (Chỉ mua hàng)</option>
              <option value="SELLER">Seller (Người bán hàng)</option>
            </select>
          </div>

          <Input label={t('auth.password')} name="password" type="password" value={form.password} onChange={handleChange} required />
          <Input label={t('auth.confirmPassword')} name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />

          <Button type="submit" fullWidth size="lg" loading={loading} className={styles.submitBtn}>
            {t('auth.registerButton')}
          </Button>
        </form>

        <p className={styles.footer}>
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className={styles.link}>
            {t('auth.loginLink')}
          </Link>
        </p>
      </Card>
    </div>
  );
}
