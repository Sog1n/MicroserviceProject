import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchOrderById, cancelOrder, clearCurrentOrder } from '@/features/orders/orderSlice';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import Spinner from '@/components/common/Spinner/Spinner';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import styles from './UserPages.module.scss';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatCurrency, formatDateTime } from '@/utils/helpers';

export default function UserOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { current: order, loading } = useAppSelector((s) => s.orders);

  useEffect(() => { if (id) dispatch(fetchOrderById(id)); return () => { dispatch(clearCurrentOrder()); }; }, [id, dispatch]);

  const handleCancel = async () => {
    if (!order) return;
    const result = await dispatch(cancelOrder(order.id));
    if (cancelOrder.fulfilled.match(result)) toast.success(t('order.cancelled'));
  };

  if (loading) return <Spinner size="lg" />;
  if (!order) return <EmptyState title={t('common.noResults')} />;

  return (
    <div className={styles.page}>
      <Link to="/user/orders" className={styles.backLink}><FiArrowLeft /> {t('common.back')}</Link>
      <h1>{t('order.orderId', { id: order.id })}</h1>
      <div className={styles.grid}>
        <Card>
          <h3>{t('order.items')}</h3>
          {(order.items || []).map((item, i) => (
            <div key={i} className={styles.orderItem}>
              <div>
                <p className={styles.bold}>Product #{item.productId}</p>
                <p className={styles.muted}>{t('common.quantity')}: {item.quantity}</p>
              </div>
              <span className={styles.bold}>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className={styles.orderTotal}>
            <span>{t('cart.orderTotal')}</span>
            <span>{formatCurrency(order.totalAmount ?? 0)}</span>
          </div>
        </Card>
        <Card>
          <h3>{t('common.status')}</h3>
          <p className={styles.statusLarge}>{order.status}</p>
          <p className={styles.muted}>{t('order.placed')}: {formatDateTime(order.orderDate)}</p>
          {order.status === 'PENDING' && (
            <Button variant="danger" onClick={handleCancel} className={styles.cancelBtn}>{t('order.cancelOrder')}</Button>
          )}
        </Card>
      </div>
    </div>
  );
}
