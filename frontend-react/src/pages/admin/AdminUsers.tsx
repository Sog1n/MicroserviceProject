import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchAdminUsers } from '@/features/admin/adminSlice';
import adminApi from '@/api/adminApi';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import Spinner from '@/components/common/Spinner/Spinner';
import styles from './AdminPages.module.scss';
import { FiSearch, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((s) => s.admin);
  const [search, setSearch] = useState('');

  useEffect(() => { dispatch(fetchAdminUsers()); }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchAdminUsers({ search }));
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminApi.deleteUser(userId);
      toast.success('User deleted');
      dispatch(fetchAdminUsers({ search }));
    } catch { toast.error(t('common.error')); }
  };

  if (loading && users.length === 0) return <Spinner size="lg" />;

  return (
    <div>
      <h2 className={styles.pageTitle}>{t('admin.userManagement')}</h2>

      <form onSubmit={handleSearch} className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <FiSearch className={styles.searchIcon} />
          <input className={styles.searchInput} placeholder={t('common.search') + '...'} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </form>

      <Card className={styles.tableCard}>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>ID</span><span>{t('auth.username')}</span><span>{t('auth.email')}</span><span>{t('auth.fullName')}</span><span>{t('admin.role')}</span><span>{t('common.actions')}</span>
          </div>
          {users.map((u) => (
            <div key={u.id} className={styles.tableRow}>
              <span>{u.id}</span>
              <span className={styles.bold}>{u.username}</span>
              <span>{u.email}</span>
              <span>{u.fullName}</span>
              <span className={styles.roleBadge}>{u.role}</span>
              <Button size="sm" variant="danger" icon={<FiTrash2 />} onClick={() => handleDelete(u.id)}>
                {t('common.delete')}
              </Button>
            </div>
          ))}
          {users.length === 0 && <p className={styles.muted}>No users found</p>}
        </div>
      </Card>
    </div>
  );
}
