import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Image, Plus, X } from 'lucide-react';
import logger from '../../utils/logger';

interface GalleryItem {
  id: string;
  albumName: string;
  caption: string;
  imageUrl: string;
  createdAt: string;
}

export const AdminGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ albumName: '', caption: '' });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await api.get('/cms/gallery');
      setItems(res.data.data || []);
    } catch (err) {
      logger.error('Failed to load gallery', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('image', file);
      data.append('albumName', form.albumName);
      data.append('caption', form.caption);
      await api.post('/cms/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ albumName: '', caption: '' });
      setFile(null);
      fetchItems();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-brand-rose border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Gallery CMS</h1>
      <div className="bg-surface-1 border border-white/8 rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-sm text-white/80">Upload Image</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Album Name" value={form.albumName} onChange={e => setForm({ ...form, albumName: e.target.value })} required className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose" />
            <input type="text" placeholder="Caption" value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Image</label>
            <label className={`flex items-center gap-3 w-full border-2 border-dashed rounded-xl px-4 py-4 cursor-pointer transition-colors ${file ? 'border-brand-rose bg-brand-rose/5' : 'border-white/8 hover:border-brand-rose-light'}`}>
              <Image className="w-5 h-5 text-brand-rose-light shrink-0" />
              <span className="text-sm text-slate-600 dark:text-slate-400 truncate">{file ? file.name : 'Click to select image'}</span>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" />
            </label>
          </div>
          <button type="submit" disabled={submitting || !file} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-rose to-brand-orange hover:from-brand-rose-dark hover:to-brand-orange-dark text-white text-xs font-bold rounded-xl disabled:opacity-50">
            <Plus className="w-4 h-4" /> {submitting ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-surface-1 border border-white/8 rounded-2xl overflow-hidden">
            <img src={item.imageUrl} alt={item.caption} className="w-full h-40 object-cover" />
            <div className="p-3">
              <p className="text-xs font-bold text-white/80">{item.albumName}</p>
              <p className="text-[10px] text-slate-400 mt-1">{item.caption || 'No caption'}</p>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-slate-400 col-span-full text-center py-8">No gallery images yet.</p>}
      </div>
    </div>
  );
};

export default AdminGallery;
