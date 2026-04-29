import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchProductById, clearCurrentProduct } from '@/features/products/productSlice';
import { addToCart } from '@/features/cart/cartSlice';
import Button from '@/components/common/Button/Button';
import Spinner from '@/components/common/Spinner/Spinner';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import styles from './ProductDetail.module.scss';
import { FiShoppingCart, FiStar, FiArrowLeft, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/helpers';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { current: product, loading, error } = useAppSelector((s) => s.products);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
    return () => { dispatch(clearCurrentProduct()); };
  }, [id, dispatch]);

  useEffect(() => {
    if (product?.img) {
      setSelectedImage(product.img);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
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

  if (loading) return <Spinner size="lg" />;
  if (error) return <EmptyState title={t('common.error')} description={error} />;
  if (!product) return <EmptyState title={t('common.noResults')} />;

  // Combine main image + other images into a gallery
  const allImages = [product.img, ...(product.otherImages || [])].filter(Boolean);
  const displayImage = selectedImage || product.img;

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setTouchEnd(null);
    if ('targetTouches' in e) {
      setTouchStart(e.targetTouches[0].clientX);
    } else {
      setTouchStart((e as React.MouseEvent).clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if ('targetTouches' in e) {
      setTouchEnd(e.targetTouches[0].clientX);
    } else {
      if (touchStart !== null) {
        setTouchEnd((e as React.MouseEvent).clientX);
      }
    }
  };

  const handlePrevImage = () => {
    if (allImages.length <= 1) return;
    const currentIndex = allImages.indexOf(displayImage);
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[prevIndex]!);
  };

  const handleNextImage = () => {
    if (allImages.length <= 1) return;
    const currentIndex = allImages.indexOf(displayImage);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setSelectedImage(allImages[nextIndex]!);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextImage();
    } else if (isRightSwipe) {
      handlePrevImage();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className={styles.page}>
      <Link to="/products" className={styles.backLink}>
        <FiArrowLeft /> {t('common.back')}
      </Link>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div 
            className={styles.mainImage}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
          >
            {displayImage ? (
              <>
                <img src={displayImage} alt={product.name} draggable="false" />
                {allImages.length > 1 && (
                  <>
                    <button className={`${styles.navButton} ${styles.prevButton}`} onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}>
                      <FiChevronLeft />
                    </button>
                    <button className={`${styles.navButton} ${styles.nextButton}`} onClick={(e) => { e.stopPropagation(); handleNextImage(); }}>
                      <FiChevronRight />
                    </button>
                  </>
                )}
              </>
            ) : (
              <span className={styles.noImage}>📦</span>
            )}
          </div>
          {allImages.length > 1 && (
            <div className={styles.thumbnails}>
              {allImages.map((img, i) => (
                <div 
                  key={i} 
                  className={`${styles.thumb} ${img === displayImage ? styles.active : ''}`}
                  onClick={() => setSelectedImage(img!)}
                >
                  <img src={img!} alt={`${product.name} ${i + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.info}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.name}>{product.name}</h1>

          <div className={styles.ratingRow}>
            <FiStar className={styles.starIcon} />
            <span className={styles.ratingValue}>{product.rate?.toFixed(1) ?? '0.0'}</span>
            <span className={styles.reviewCount}>({product.votes ?? 0} {t('product.reviews')})</span>
            <span className={styles.reviewCount}>· {product.sold ?? 0} {t('product.sold')}</span>
          </div>

          <p className={styles.price}>{formatCurrency(product.price ?? 0)}</p>

          {(product.discount ?? 0) > 0 && (
            <p className={styles.discount}>-{product.discount}%</p>
          )}

          <div className={styles.stockBadge}>
            {(product.stockQuantity ?? 0) > 0 ? (
              <><FiCheck /> {t('product.inStock')} ({product.stockQuantity})</>
            ) : (
              <span className={styles.oos}>{t('product.outOfStock')}</span>
            )}
          </div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className={styles.descriptionSection}>
              <h3>Sizes</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.sizes.map((s) => (
                  <span key={s} style={{ padding: '4px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className={styles.descriptionSection}>
              <h3>Colors</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.colors.map((c) => (
                  <span key={c.id} style={{ padding: '4px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: 14, height: 14, borderRadius: '50%', background: c.colorCode, display: 'inline-block' }} />
                    {c.colorName}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <Button
              size="lg"
              icon={<FiShoppingCart />}
              onClick={handleAddToCart}
              disabled={(product.stockQuantity ?? 0) === 0}
              fullWidth
            >
              {t('product.addToCart')}
            </Button>
          </div>

          <div className={styles.descriptionSection}>
            <h3>{t('product.description')}</h3>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
