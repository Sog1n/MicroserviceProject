import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchPendingProducts } from '@/features/admin/adminSlice';
import adminApi from '@/api/adminApi';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import Spinner from '@/components/common/Spinner/Spinner';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import styles from './AdminPages.module.scss';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/helpers';

export default function AdminProductModeration() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { pendingProducts, loading } = useAppSelector((s) => s.admin);

  useEffect(() => { dispatch(fetchPendingProducts()); }, [dispatch]);

  const handleModerate = async (productId: number, action: 'APPROVE' | 'REJECT') => {
    try {
      await adminApi.moderateProduct(productId, action);
      toast.success(`Product ${action.toLowerCase()}d`);
      dispatch(fetchPendingProducts());
    } catch { toast.error(t('common.error')); }
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <div>
      <h2 className={styles.pageTitle}>{t('admin.productModeration')}</h2>

      {(!pendingProducts || pendingProducts.length === 0) ? (
        <EmptyState title="No pending products" description="All products have been reviewed." />
      ) : (
        <div className={styles.moderationGrid}>
          {pendingProducts.map((product) => (
            <Card key={product.id} className={styles.modCard}>
              <div className={styles.modImage}>
                {product.img ? <img src={product.img} alt={product.name} /> : <span>📦</span>}
              </div>
              <div className={styles.modInfo}>
                <h4>{product.name}</h4>
                <p className={styles.muted}>{product.category}</p>
                <p className={styles.bold}>{formatCurrency(product.price ?? 0)}</p>
                <p className={styles.muted}>Stock: {product.stockQuantity ?? 0}</p>
              </div>
              <div className={styles.modActions}>
                <Button size="sm" onClick={() => handleModerate(product.id, 'APPROVE')}>{t('admin.approve')}</Button>
                <Button size="sm" variant="danger" onClick={() => handleModerate(product.id, 'REJECT')}>{t('admin.reject')}</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
