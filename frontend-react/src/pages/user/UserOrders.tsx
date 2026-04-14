import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchUserOrders } from '@/features/orders/orderSlice';
import Spinner from '@/components/common/Spinner/Spinner';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import Button from '@/components/common/Button/Button';
import styles from './UserPages.module.scss';
import { FiEye, FiPackage } from 'react-icons/fi';
import { formatCurrency, formatDate } from '@/utils/helpers';

const statusColors: Record<string, string> = {
  PENDING: '#fdcb6e',
  APPROVED: '#00b894',
  REJECTED: '#d63031',
  SHIPPED: '#6c5ce7',
  DELIVERED: '#00b894',
};

export default function UserOrders() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.orders);

  useEffect(() => { dispatch(fetchUserOrders()); }, [dispatch]);

  if (loading) return <Spinner size="lg" />;
  if (error) return <EmptyState title={t('common.error')} description={error} />;
  if (!items || items.length === 0) return <EmptyState icon={<FiPackage />} title={t('order.empty')} action={<Link to="/products"><Button>{t('cart.continueShopping')}</Button></Link>} />;

  return (
    <div className={styles.page}>
      <h1>{t('order.title')}</h1>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>Order</span>
          <span>{t('common.date')}</span>
          <span>{t('common.status')}</span>
          <span>{t('common.total')}</span>
          <span>{t('common.actions')}</span>
        </div>
        {items.map((order) => (
          <div key={order.id} className={styles.tableRow}>
            <span className={styles.orderId}>#{order.id}</span>
            <span>{formatDate(order.orderDate)}</span>
            <span className={styles.statusBadge} style={{ backgroundColor: `${statusColors[order.status] ?? '#636e72'}20`, color: statusColors[order.status] ?? '#636e72' }}>
              {order.status}
            </span>
            <span className={styles.bold}>{formatCurrency(order.totalAmount ?? 0)}</span>
            <Link to={`/user/orders/${order.id}`}><Button size="sm" variant="ghost" icon={<FiEye />}>{t('order.viewDetail')}</Button></Link>
          </div>
        ))}
      </div>
    </div>
  );
}
