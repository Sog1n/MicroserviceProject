import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchAdminAllProducts } from '@/features/admin/adminSlice';
import adminApi from '@/api/adminApi';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import Spinner from '@/components/common/Spinner/Spinner';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import styles from './AdminPages.module.scss';
import { FiSearch, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/helpers';

export default function AdminProducts() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((s) => s.admin);
  const [search, setSearch] = useState('');

  useEffect(() => { dispatch(fetchAdminAllProducts()); }, [dispatch]);

  const handleDelete = async (productId: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminApi.deleteProduct(productId);
      toast.success('Product deleted');
      dispatch(fetchAdminAllProducts());
    } catch { toast.error(t('common.error')); }
  };

  const filteredProducts = products.filter(p => 
    search === '' || 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && products.length === 0) return <Spinner size="lg" />;

  return (
    <div>
      <h2 className={styles.pageTitle}>{t('admin.productManagement') || 'Product Management'}</h2>

      <div className={styles.toolbar} style={{ marginBottom: '20px' }}>
        <div className={styles.searchWrap}>
          <FiSearch className={styles.searchIcon} style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#636e72'}}/>
          <input 
            className={styles.searchInput} 
            placeholder={t('common.search') + '...'} 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            style={{paddingLeft: '35px', padding: '10px 10px 10px 35px', border: '1px solid #ddd', borderRadius: '8px', width: '100%', maxWidth: '300px'}}
          />
        </div>
      </div>

      {(!filteredProducts || filteredProducts.length === 0) ? (
        <EmptyState title="No products found" />
      ) : (
        <Card className={styles.tableCard}>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>ID</span><span>{t('product.name') || 'Name'}</span><span>Category</span><span>Price</span><span>Stock</span><span>Status</span><span>{t('common.actions')}</span>
            </div>
            {filteredProducts.map((p) => (
              <div key={p.id} className={styles.tableRow} style={{alignItems: 'center'}}>
                <span>{p.id}</span>
                <span className={styles.bold} style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  {p.img ? <img src={p.img} alt={p.name} style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} /> : <span>📦</span>}
                  {p.name}
                </span>
                <span>{p.category}</span>
                <span className={styles.bold}>{formatCurrency(p.price ?? 0)}</span>
                <span>{p.stockQuantity ?? 0}</span>
                <span className={styles.roleBadge}>{p.status}</span>
                <Button size="sm" variant="danger" icon={<FiTrash2 />} onClick={() => handleDelete(p.id)}>
                  {t('common.delete')}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
