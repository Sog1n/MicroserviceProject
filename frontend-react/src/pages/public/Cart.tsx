import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { removeFromCart, updateQuantity } from '@/features/cart/cartSlice';
import Button from '@/components/common/Button/Button';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import styles from './Cart.module.scss';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/helpers';

export default function Cart() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items } = useAppSelector((s) => s.cart);
  const { user } = useAppSelector((s) => s.auth);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId));
    toast.success(t('cart.itemRemoved'));
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<FiShoppingBag />}
        title={t('cart.empty')}
        action={<Link to="/products"><Button>{t('cart.continueShopping')}</Button></Link>}
      />
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('cart.title')}</h1>

      <div className={styles.layout}>
        <div className={styles.itemList}>
          {items.map((item) => (
            <div key={item.productId} className={styles.item}>
              <div className={styles.itemImage}>
                {item.image ? <img src={item.image} alt={item.name} /> : <span>📦</span>}
              </div>
              <div className={styles.itemInfo}>
                <Link to={`/products/${item.productId}`} className={styles.itemName}>{item.name}</Link>
                <span className={styles.itemPrice}>{formatCurrency(item.price)}</span>
              </div>
              <div className={styles.qtyControls}>
                <button className={styles.qtyBtn} onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))} disabled={item.quantity <= 1}>
                  <FiMinus />
                </button>
                <span className={styles.qty}>{item.quantity}</span>
                <button className={styles.qtyBtn} onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))} disabled={item.quantity >= item.stock}>
                  <FiPlus />
                </button>
              </div>
              <span className={styles.lineTotal}>{formatCurrency(item.price * item.quantity)}</span>
              <button className={styles.removeBtn} onClick={() => handleRemove(item.productId)}>
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h3>{t('checkout.orderSummary')}</h3>
          <div className={styles.row}>
            <span>{t('cart.subtotal')}</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className={styles.row}>
            <span>{t('cart.shipping')}</span>
            <span className={styles.free}>{t('cart.free')}</span>
          </div>
          <div className={`${styles.row} ${styles.totalRow}`}>
            <span>{t('cart.orderTotal')}</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <Button fullWidth size="lg" onClick={handleCheckout}>
            {t('cart.checkout')}
          </Button>
        </div>
      </div>
    </div>
  );
}
