import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchSellerOrders } from '@/features/seller/sellerSlice';
import sellerApi from '@/api/sellerApi';
import Card from '@/components/common/Card/Card';
import Spinner from '@/components/common/Spinner/Spinner';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import styles from './SellerPages.module.scss';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '@/utils/helpers';

const ORDER_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'SHIPPED', 'DELIVERED'];

export default function SellerOrders() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((s) => s.seller);

  useEffect(() => { dispatch(fetchSellerOrders()); }, [dispatch]);

  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
      await sellerApi.updateOrderStatus(orderId, status);
      toast.success(t('seller.updateStatus'));
      dispatch(fetchSellerOrders());
    } catch { toast.error(t('common.error')); }
  };

  if (loading && (!orders || orders.length === 0)) return <Spinner size="lg" />;
  if (!orders || orders.length === 0) return <EmptyState title="No orders yet" />;

  return (
    <div>
      <h2 className={styles.pageTitle}>{t('seller.orderManagement')}</h2>
      <Card className={styles.tableCard}>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>Order</span><span>{t('common.date')}</span><span>{t('common.status')}</span><span>{t('common.total')}</span><span>{t('common.actions')}</span>
          </div>
          {orders.map((o) => (
            <div key={o.id} className={styles.tableRow}>
              <span className={styles.orderId}>#{o.id}</span>
              <span>{formatDate(o.orderDate)}</span>
              <span className={styles.statusBadge}>{o.status}</span>
              <span className={styles.bold}>{formatCurrency(o.totalAmount ?? 0)}</span>
              <select className={styles.statusSelect} value={o.status} onChange={(e) => handleUpdateStatus(o.id, e.target.value)}>
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
