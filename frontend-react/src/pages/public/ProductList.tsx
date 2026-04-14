import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchProducts } from '@/features/products/productSlice';
import { addToCart } from '@/features/cart/cartSlice';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import Spinner from '@/components/common/Spinner/Spinner';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import styles from './ProductList.module.scss';
import { FiSearch, FiShoppingCart, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/helpers';
import type { Product } from '@/api/productApi';

const PAGE_SIZE = 12;

export default function ProductList() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.products);

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts(undefined));
  }, [dispatch]);

  // Client-side search, sort, pagination since backend returns plain array
  const filtered = useMemo(() => {
    let result = items || [];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price,asc') {
      result = [...result].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sortBy === 'price,desc') {
      result = [...result].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    } else if (sortBy === 'createdAt,desc') {
      result = [...result].sort((a, b) => (b.addedDate ?? '').localeCompare(a.addedDate ?? ''));
    } else if (sortBy === 'rating,desc') {
      result = [...result].sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0));
    }

    return result;
  }, [items, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      productId: String(product.id),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.img || '',
      stock: product.stockQuantity ?? 0,
      sellerId: product.sellerId
    }));
    toast.success(t('product.addedToCart'));
  };

  if (loading && (!items || items.length === 0)) return <Spinner size="lg" />;

  if (error) {
    return (
      <EmptyState
        title={t('common.error')}
        description={error}
        action={<Button onClick={() => dispatch(fetchProducts(undefined))}>{t('common.retry')}</Button>}
      />
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <FiSearch className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder={t('common.search') + '...'}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(0); }}
          />
        </form>

        <select className={styles.sortSelect} value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(0); }}>
          <option value="">{t('product.sortBy')}</option>
          <option value="price,asc">{t('product.priceLowHigh')}</option>
          <option value="price,desc">{t('product.priceHighLow')}</option>
          <option value="createdAt,desc">{t('product.newest')}</option>
          <option value="rating,desc">{t('product.rating')}</option>
        </select>
      </div>

      {paged.length === 0 ? (
        <EmptyState title={t('common.noResults')} />
      ) : (
        <>
          <p className={styles.count}>{t('product.showing', { count: filtered.length })}</p>
          <div className={styles.grid}>
            {paged.map((product) => (
              <Card key={product.id} className={styles.productCard} hoverable>
                <Link to={`/products/${product.id}`} className={styles.imageLink}>
                  <div className={styles.imagePlaceholder}>
                    {product.img ? (
                      <img src={product.img} alt={product.name} />
                    ) : (
                      <span className={styles.noImage}>📦</span>
                    )}
                  </div>
                </Link>
                <div className={styles.cardBody}>
                  <Link to={`/products/${product.id}`} className={styles.productName}>
                    {product.name}
                  </Link>
                  <div className={styles.rating}>
                    <FiStar className={styles.starIcon} />
                    <span>{product.rate?.toFixed(1) ?? '0.0'}</span>
                    <span className={styles.reviewCount}>({product.votes ?? 0})</span>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.price}>{formatCurrency(product.price ?? 0)}</span>
                    <Button
                      size="sm"
                      icon={<FiShoppingCart />}
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                      disabled={(product.stockQuantity ?? 0) === 0}
                    >
                      {(product.stockQuantity ?? 0) === 0 ? t('product.outOfStock') : t('product.addToCart')}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button className={styles.pageBtn} disabled={currentPage === 0} onClick={() => setCurrentPage((p) => p - 1)}>
                <FiChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`${styles.pageBtn} ${i === currentPage ? styles.active : ''}`}
                  onClick={() => setCurrentPage(i)}
                >
                  {i + 1}
                </button>
              ))}
              <button className={styles.pageBtn} disabled={currentPage === totalPages - 1} onClick={() => setCurrentPage((p) => p + 1)}>
                <FiChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
