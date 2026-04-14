import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchAdminStats, fetchAdminRecentOrders } from '@/features/admin/adminSlice';
import Card from '@/components/common/Card/Card';
import Spinner from '@/components/common/Spinner/Spinner';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import styles from './AdminPages.module.scss';
import { FiUsers, FiShoppingBag, FiBox, FiDollarSign } from 'react-icons/fi';
import { formatCurrency, formatDate } from '@/utils/helpers';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { stats, recentOrders, loading, error } = useAppSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchAdminRecentOrders({ size: 5 }));
  }, [dispatch]);

  if (loading && !stats) return <Spinner size="lg" />;
  if (error) return <EmptyState title={t('common.error')} description={error} />;

  const kpis = [
    { icon: <FiUsers />, label: t('admin.totalUsers'), value: stats?.totalUsers ?? 0, color: '#6c5ce7' },
    { icon: <FiShoppingBag />, label: t('admin.totalOrders'), value: stats?.totalOrders ?? 0, color: '#00cec9' },
    { icon: <FiBox />, label: t('admin.totalProducts'), value: stats?.totalProducts ?? 0, color: '#fd79a8' },
    { icon: <FiDollarSign />, label: t('admin.totalRevenue'), value: formatCurrency(stats?.totalRevenue ?? 0), color: '#00b894' },
  ];

  return (
    <div>
      <h2 className={styles.pageTitle}>{t('admin.dashboard')}</h2>

      <div className={styles.kpiGrid}>
        {kpis.map((kpi) => (
          <Card key={kpi.label} className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: `${kpi.color}18`, color: kpi.color }}>{kpi.icon}</div>
            <div>
              <p className={styles.kpiValue}>{kpi.value}</p>
              <p className={styles.kpiLabel}>{kpi.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className={styles.tableCard}>
        <h3>{t('admin.recentOrders')}</h3>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>Order</span><span>{t('common.date')}</span><span>{t('common.status')}</span><span>{t('common.total')}</span>
          </div>
          {recentOrders.map((order) => (
            <div key={order.id} className={styles.tableRow}>
              <span className={styles.orderId}>#{order.id}</span>
              <span>{formatDate(order.orderDate)}</span>
              <span className={styles.statusBadge}>{order.status}</span>
              <span className={styles.bold}>{formatCurrency(order.totalAmount ?? 0)}</span>
            </div>
          ))}
          {recentOrders.length === 0 && <p className={styles.muted}>No recent orders</p>}
        </div>
      </Card>
    </div>
  );
}
