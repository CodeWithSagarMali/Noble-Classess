import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, Plus } from 'lucide-react';
import logger from '../../utils/logger';

interface Teacher {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  user: { email: string };
}

export const AdminTeachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '', specialization: '', qualifications: '', experience: '', bio: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/admin/teachers');
      setTeachers(res.data.data || []);
    } catch (err) {
      logger.error('Failed to load teachers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeachers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/teachers', form);
      setForm({ email: '', password: '', name: '', phone: '', specialization: '', qualifications: '', experience: '', bio: '' });
      fetchTeachers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create teacher.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-brand-rose border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Manage Teachers</h1>
      <div className="bg-surface-1 border border-white/8 rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-sm text-white/80">Add New Teacher</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose" />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose" />
          <input type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose" />
          <input type="text" placeholder="Specialization" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose" />
          <input type="password" placeholder="Initial Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose" />
          <input type="text" placeholder="Qualifications" value={form.qualifications} onChange={e => setForm({ ...form, qualifications: e.target.value })} className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose" />
          <button type="submit" disabled={submitting} className="sm:col-span-2 flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-rose to-brand-orange hover:from-brand-rose-dark hover:to-brand-orange-dark text-white text-xs font-bold rounded-xl disabled:opacity-50">
            <Plus className="w-4 h-4" /> {submitting ? 'Adding...' : 'Add Teacher'}
          </button>
        </form>
      </div>
      <div className="bg-surface-1 border border-white/8 rounded-2xl overflow-hidden">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-white/8">
            <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase">Name</th>
            <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase">Email</th>
            <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase">Phone</th>
            <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase">Specialization</th>
          </tr></thead>
          <tbody>
            {teachers.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-slate-400">No teachers found.</td></tr>}
            {teachers.map(t => (
              <tr key={t.id} className="border-b border-white/8">
                <td className="py-3 px-4 font-semibold text-white/80">{t.name}</td>
                <td className="py-3 px-4 text-slate-400">{t.user.email}</td>
                <td className="py-3 px-4 text-slate-400">{t.phone}</td>
                <td className="py-3 px-4 text-slate-400">{t.specialization || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTeachers;
