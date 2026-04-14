import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/hooks';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Input/Input';
import styles from './UserPages.module.scss';
import { FiUser, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import userApi from '@/api/userApi';

export default function UserProfile() {
  const { t } = useTranslation();
  const { user } = useAppSelector((s) => s.auth);
  const [form, setForm] = useState({ fullName: user?.fullName || '', email: user?.email || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!user?.id) return;
      await userApi.updateProfile(user.id, form);
      toast.success(t('profile.updated'));
    } catch { toast.error(t('common.error')); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userApi.changePassword(pwForm);
      toast.success(t('profile.passwordChanged'));
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch { toast.error(t('common.error')); }
    finally { setSaving(false); }
  };

  return (
    <div className={styles.page}>
      <h1>{t('profile.title')}</h1>
      <div className={styles.grid}>
        <Card>
          <div className={styles.sectionHeader}><FiUser /> <h3>{t('profile.personalInfo')}</h3></div>
          <form onSubmit={handleUpdate} className={styles.form}>
            <Input label={t('auth.fullName')} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <Input label={t('auth.email')} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label={t('auth.username')} value={user?.username || ''} disabled />
            <Input label={t('admin.role')} value={user?.role || ''} disabled />
            <Button type="submit" loading={saving}>{t('common.save')}</Button>
          </form>
        </Card>
        <Card>
          <div className={styles.sectionHeader}><FiLock /> <h3>{t('profile.changePassword')}</h3></div>
          <form onSubmit={handlePasswordChange} className={styles.form}>
            <Input label={t('profile.currentPassword')} type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
            <Input label={t('profile.newPassword')} type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required />
            <Button type="submit" loading={saving}>{t('common.save')}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
