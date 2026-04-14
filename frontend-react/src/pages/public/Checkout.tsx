import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { createOrder } from '@/features/orders/orderSlice';
import { clearCart } from '@/features/cart/cartSlice';
import Button from '@/components/common/Button/Button';
import Card from '@/components/common/Card/Card';
import styles from './Checkout.module.scss';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/helpers';

export default function Checkout() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items } = useAppSelector((s) => s.cart);
  const { user } = useAppSelector((s) => s.auth);
  const { loading } = useAppSelector((s) => s.orders);

  const [_payment, setPayment] = useState('COD');

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    // Group items by sellerId
    const groups: Record<number, typeof items> = {};
    items.forEach((item) => {
      // If sellerId is undefined, fallback to 1 (Admin/System)
      const sId = item.sellerId || 1; 
      if (!groups[sId]) groups[sId] = [];
      groups[sId].push(item);
    });

    try {
      // Send multiple order creation requests (one per seller)
      const promises = Object.entries(groups).map(([sellerIdStr, groupItems]) => {
        const subtotalGroup = groupItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        return dispatch(createOrder({
          userId: user.id,
          sellerId: Number(sellerIdStr),
          totalAmount: subtotalGroup,
          status: 'PENDING',
          items: groupItems.map((i) => ({
            productId: Number(i.productId),
            quantity: i.quantity,
            price: i.price,
          })),
        })).unwrap(); // createAsyncThunk unwrap throws error if rejected
      });

      await Promise.all(promises);
      
      dispatch(clearCart());
      toast.success(t('checkout.orderSuccess'));
      navigate(`/user/orders`);
    } catch (err) {
      toast.error(t('checkout.orderFailed'));
    }
  };

  return (
    <div className={styles.page}>
      <h1>{t('checkout.title')}</h1>
      <form className={styles.layout} onSubmit={handlePlaceOrder}>
        <div className={styles.formSection}>
          <Card className={styles.section}>
            <h3>{t('checkout.paymentMethod')}</h3>
            <div className={styles.radioGroup}>
              {['COD', 'CREDIT_CARD', 'BANK_TRANSFER'].map((m) => (
                <label key={m} className={`${styles.radioLabel} ${_payment === m ? styles.selected : ''}`}>
                  <input type="radio" name="payment" value={m} checked={_payment === m} onChange={() => setPayment(m)} />
                  <span>{m === 'COD' ? 'Cash on Delivery' : m === 'CREDIT_CARD' ? 'Credit Card' : 'Bank Transfer'}</span>
                </label>
              ))}
            </div>
          </Card>
        </div>
        <Card className={styles.summary}>
          <h3>{t('checkout.orderSummary')}</h3>
          {items.map((i) => (
            <div key={i.productId} className={styles.summaryItem}>
              <span>{i.name} × {i.quantity}</span>
              <span>{formatCurrency(i.price * i.quantity)}</span>
            </div>
          ))}
          <div className={styles.total}>
            <span>{t('cart.orderTotal')}</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <Button type="submit" fullWidth size="lg" loading={loading}>{t('checkout.placeOrder')}</Button>
        </Card>
      </form>
    </div>
  );
}
