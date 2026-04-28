import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Input/Input';
import Spinner from '@/components/common/Spinner/Spinner';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import styles from './AdminPages.module.scss';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import productApi, { type Category } from '@/api/productApi';

export default function AdminCategories() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', displayName: '' });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await productApi.getCategories();
      setCategories(res.data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setForm({ name: '', displayName: '' });
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (c: Category) => {
    setForm({ name: c.name, displayName: c.displayName });
    setEditId(c.id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await productApi.updateCategory(editId, form);
        toast.success('Category updated successfully');
      } else {
        await productApi.createCategory(form);
        toast.success('Category created successfully');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await productApi.deleteCategory(id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch {
      toast.error('Failed to delete category');
    }
  };

  if (loading && categories.length === 0) return <Spinner size="lg" />;

  return (
    <div>
      <div className={styles.titleRow}>
        <h2 className={styles.pageTitle}>Category Management</h2>
        <Button icon={<FiPlus />} onClick={openCreate}>Add Category</Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState title="No categories found" action={<Button onClick={openCreate}>Add Category</Button>} />
      ) : (
        <Card className={styles.tableCard}>
          <div className={styles.tableResponsive}>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span>ID</span>
                <span>Name</span>
                <span>Display Name</span>
                <span>Actions</span>
              </div>
              {categories.map((c) => (
                <div key={c.id} className={styles.tableRow}>
                  <span>{c.id}</span>
                  <span className={styles.bold}>{c.name}</span>
                  <span>{c.displayName}</span>
                  <div className={styles.actions}>
                    <Button size="sm" variant="ghost" icon={<FiEdit />} onClick={() => openEdit(c)} />
                    <Button size="sm" variant="ghost" icon={<FiTrash2 />} onClick={() => handleDelete(c.id)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)} style={{ zIndex: 9999 }}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editId ? 'Edit Category' : 'Add Category'}</h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <Input
                label="Name (e.g. laptop)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Display Name (e.g. Laptop & Macbook)"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                required
              />
              <Button type="submit" fullWidth loading={saving}>
                {editId ? 'Save Changes' : 'Create Category'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
