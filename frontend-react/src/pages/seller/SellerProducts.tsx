import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchSellerProducts } from '@/features/seller/sellerSlice';
import sellerApi from '@/api/sellerApi';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Input/Input';
import Spinner from '@/components/common/Spinner/Spinner';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import styles from './SellerPages.module.scss';
import { FiPlus, FiEdit, FiTrash2, FiX, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/helpers';
import type { Product } from '@/api/productApi';

const emptyForm = { name: '', description: '', price: 0, stockQuantity: 50, category: '', img: '', otherImages: [] as string[] };

export default function SellerProducts() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((s) => s.seller);
  const { user } = useAppSelector((s) => s.auth);
  
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  
  // Custom Thumbnail
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Other Images
  const [otherImageFiles, setOtherImageFiles] = useState<File[]>([]);
  const [otherImagePreviews, setOtherImagePreviews] = useState<string[]>([]);

  useEffect(() => { dispatch(fetchSellerProducts()); }, [dispatch]);

  const openCreate = () => { 
    setForm(emptyForm); 
    setEditId(null); 
    setImageFile(null);
    setImagePreview('');
    setOtherImageFiles([]);
    setOtherImagePreviews([]);
    setShowModal(true); 
  };
  
  const openEdit = (p: Product) => {
    setForm({ 
      name: p.name, 
      description: p.description, 
      price: p.price, 
      stockQuantity: p.stockQuantity, 
      category: p.category, 
      img: p.img || '',
      otherImages: p.otherImages || []
    });
    setEditId(p.id);
    setImageFile(null);
    setImagePreview(p.img || '');
    setOtherImageFiles([]);
    setOtherImagePreviews([]);
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      e.target.value = ''; // reset
    }
  };

  const handleOtherImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setOtherImageFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setOtherImagePreviews(prev => [...prev, ...newPreviews]);
      e.target.value = ''; // reset
    }
  };

  const removeExistingOtherImage = (index: number) => {
    setForm(prev => {
      const newImages = [...(prev.otherImages || [])];
      newImages.splice(index, 1);
      return { ...prev, otherImages: newImages };
    });
  };

  const removeNewOtherImage = (index: number) => {
    setOtherImageFiles(prev => prev.filter((_, i) => i !== index));
    setOtherImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || !uploadPreset) {
      throw new Error("Missing Cloudinary config (VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET in .env)");
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      throw new Error(errData?.error?.message || "Failed to upload image to Cloudinary");
    }
    
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let finalImgUrl = form.img;
    let finalOtherImageUrls = [...(form.otherImages || [])];

    try {
      if (imageFile) {
        toast.loading("Uploading primary image...", { id: "upload-main" });
        finalImgUrl = await uploadImageToCloudinary(imageFile);
        toast.success("Primary image uploaded", { id: "upload-main" });
      }

      if (otherImageFiles.length > 0) {
        toast.loading(`Uploading ${otherImageFiles.length} other images...`, { id: "upload-other" });
        const uploadedUrls = await Promise.all(otherImageFiles.map(file => uploadImageToCloudinary(file)));
        finalOtherImageUrls = [...finalOtherImageUrls, ...uploadedUrls];
        toast.success("Other images uploaded", { id: "upload-other" });
      }

      const productData = { 
        ...form, 
        img: finalImgUrl, 
        otherImages: finalOtherImageUrls 
      };

      if (editId) {
        await sellerApi.updateProduct(editId, productData);
        toast.success(t('seller.productUpdated'));
      } else {
        await sellerApi.createProduct({ ...productData, sellerId: user?.id, status: 'PENDING' });
        toast.success(t('seller.productCreated'));
      }
      setShowModal(false);
      dispatch(fetchSellerProducts());
    } catch (err: any) { 
      toast.error(err.message || t('common.error'), { id: "upload-error" });
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await sellerApi.deleteProduct(id);
      toast.success(t('seller.productDeleted'));
      dispatch(fetchSellerProducts());
    } catch { toast.error(t('common.error')); }
  };

  if (loading && products.length === 0) return <Spinner size="lg" />;

  return (
    <div>
      <div className={styles.titleRow}>
        <h2 className={styles.pageTitle}>{t('seller.productManagement')}</h2>
        <Button icon={<FiPlus />} onClick={openCreate}>{t('seller.addProduct')}</Button>
      </div>

      {products.length === 0 ? (
        <EmptyState title="No products yet" action={<Button onClick={openCreate}>{t('seller.addProduct')}</Button>} />
      ) : (
        <div className={styles.productGrid}>
          {products.map((p) => (
            <Card key={p.id} className={styles.productCard}>
              <div className={styles.productImage}>
                {p.img ? <img src={p.img} alt={p.name} /> : <span>📦</span>}
              </div>
              <div className={styles.productInfo}>
                <h4>{p.name}</h4>
                <span className={styles.muted}>{p.category}</span>
                <span className={styles.bold}>{formatCurrency(p.price ?? 0)}</span>
                <span className={styles.muted}>Stock: {p.stockQuantity}</span>
                <span className={`${styles.statusBadge} ${p.status === 'APPROVED' ? styles.active : ''}`}>{p.status}</span>
              </div>
              <div className={styles.productActions}>
                <Button size="sm" variant="ghost" icon={<FiEdit />} onClick={() => openEdit(p)}>{t('common.edit')}</Button>
                <Button size="sm" variant="danger" icon={<FiTrash2 />} onClick={() => handleDelete(p.id)}>{t('common.delete')}</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)} style={{ zIndex: 9999 }}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className={styles.modalHeader}>
              <h3>{editId ? t('seller.editProduct') : t('seller.addProduct')}</h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <Input label={t('seller.productName')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input label={t('seller.productDescription')} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              
              <div className={styles.formRow}>
                <Input label={t('seller.productPrice')} type="number" value={String(form.price)} onChange={(e) => setForm({ ...form, price: +e.target.value })} required />
                <Input label={t('seller.productStock')} type="number" value={String(form.stockQuantity)} onChange={(e) => setForm({ ...form, stockQuantity: +e.target.value })} required />
              </div>
              
              <Input label={t('seller.productCategory')} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              
              {/* Primary Image Upload */}
              <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px dashed #ced4da' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.95rem', color: '#2d3436' }}>
                  Primary Thumbnail
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  style={{ display: 'block', marginBottom: '10px' }} 
                />
                {(imagePreview || form.img) && (
                  <img 
                    src={imagePreview || form.img} 
                    alt="Preview" 
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #dfe6e9' }} 
                  />
                )}
              </div>

              {/* Other Images Upload */}
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px dashed #ced4da' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.95rem', color: '#2d3436' }}>
                  Other Images (Gallery)
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple
                  onChange={handleOtherImagesChange} 
                  style={{ display: 'block', marginBottom: '10px' }} 
                />
                
                {/* Display Existing + New Gallery Images */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                  
                  {/* Existing Images */}
                  {(form.otherImages || []).map((imgUrl, idx) => (
                    <div key={`exist-${idx}`} style={{ position: 'relative' }}>
                      <img src={imgUrl} alt="Gallery" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #dfe6e9' }} />
                      <button 
                        type="button" 
                        onClick={() => removeExistingOtherImage(idx)} 
                        style={{ position: 'absolute', top: -5, right: -5, background: '#d63031', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}

                  {/* New Previews */}
                  {otherImagePreviews.map((preview, idx) => (
                    <div key={`new-${idx}`} style={{ position: 'relative' }}>
                      <img src={preview} alt="New Gallery" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #0984e3' }} />
                      <span style={{ position: 'absolute', bottom: 0, left: 0, background: '#0984e3', color: 'white', fontSize: '10px', padding: '2px 4px', borderRadius: '0 4px 0 8px' }}>New</span>
                      <button 
                        type="button" 
                        onClick={() => removeNewOtherImage(idx)} 
                        style={{ position: 'absolute', top: -5, right: -5, background: '#d63031', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}

                </div>
              </div>

              <Button type="submit" fullWidth loading={saving}>
                {editId ? t('common.save') : t('common.create')}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
