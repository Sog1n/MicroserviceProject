import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchSellerStats, fetchSellerOrders, fetchLowStockProducts } from '@/features/seller/sellerSlice';
import Card from '@/components/common/Card/Card';
import Spinner from '@/components/common/Spinner/Spinner';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import styles from './SellerPages.module.scss';
import { FiBox, FiShoppingBag, FiDollarSign, FiAlertTriangle } from 'react-icons/fi';
import { formatCurrency, formatDate } from '@/utils/helpers';

export default function SellerDashboard() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { stats, orders, lowStockProducts, loading, error } = useAppSelector((s) => s.seller);

  useEffect(() => {
    dispatch(fetchSellerStats());
    dispatch(fetchSellerOrders({ size: 5 }));
    dispatch(fetchLowStockProducts());
  }, [dispatch]);

  if (loading && !stats) return <Spinner size="lg" />;
  if (error) return <EmptyState title={t('common.error')} description={error} />;

  const kpis = [
    { icon: <FiBox />, label: t('seller.totalProducts'), value: stats?.totalProducts ?? 0, color: '#6c5ce7' },
    { icon: <FiShoppingBag />, label: t('seller.totalSold'), value: stats?.totalSold ?? 0, color: '#00cec9' },
    { icon: <FiDollarSign />, label: t('seller.totalRevenue'), value: formatCurrency(stats?.totalRevenue ?? 0), color: '#00b894' },
    { icon: <FiAlertTriangle />, label: t('seller.lowStock'), value: stats?.lowStockCount ?? 0, color: '#d63031' },
  ];

  return (
    <div>
      <h2 className={styles.pageTitle}>{t('seller.dashboard')}</h2>

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

      <div className={styles.dashGrid}>
        <Card className={styles.tableCard}>
          <h3>{t('seller.recentOrders')}</h3>
          {(!orders || orders.length === 0) ? <p className={styles.muted}>No orders yet</p> : (
            <div className={styles.table}>
              <div className={styles.tableHeader}><span>Order</span><span>{t('common.date')}</span><span>{t('common.status')}</span><span>{t('common.total')}</span></div>
              {orders.map((o) => (
                <div key={o.id} className={styles.tableRow}>
                  <span className={styles.orderId}>#{o.id}</span>
                  <span>{formatDate(o.orderDate)}</span>
                  <span className={styles.statusBadge}>{o.status}</span>
                  <span className={styles.bold}>{formatCurrency(o.totalAmount ?? 0)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className={styles.tableCard}>
          <h3>{t('seller.lowStockProducts')}</h3>
          {(!lowStockProducts || lowStockProducts.length === 0) ? <p className={styles.muted}>All stocked up!</p> : (
            <div className={styles.lowStockList}>
              {lowStockProducts.map((p) => (
                <div key={p.id} className={styles.lowStockItem}>
                  <span className={styles.bold}>{p.name}</span>
                  <span className={styles.stockWarning}>{p.stockQuantity} left</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
