import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Calendar, Plus } from 'lucide-react';
import logger from '../../utils/logger';

interface Batch {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  course: { name: string };
  teacher: { name: string } | null;
  _count: { students: number };
}

export const AdminBatches: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', startTime: '', endTime: '', courseId: '', teacherId: '' });
  const [submitting, setSubmitting] = useState(false);
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);

  const fetchData = async () => {
    try {
      const [batchRes, courseRes] = await Promise.allSettled([
        api.get('/admin/batches'),
        api.get('/admin/courses'),
      ]);
      if (batchRes.status === 'fulfilled') setBatches(batchRes.value.data.data || []);
      if (courseRes.status === 'fulfilled') setCourses(courseRes.value.data.data || []);
    } catch (err) {
      logger.error('Failed to load batches', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/batches', form);
      setForm({ name: '', startTime: '', endTime: '', courseId: '', teacherId: '' });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create batch.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-brand-rose border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Manage Batches</h1>
      <div className="bg-surface-1 border border-white/8 rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-sm text-white/80">Create New Batch</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" placeholder="Batch Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose" />
          <select value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })} required className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose">
            <option value="">Select Course</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} required className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose" />
          <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} required className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose" />
          <button type="submit" disabled={submitting} className="sm:col-span-2 flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-rose to-brand-orange hover:from-brand-rose-dark hover:to-brand-orange-dark text-white text-xs font-bold rounded-xl disabled:opacity-50">
            <Plus className="w-4 h-4" /> {submitting ? 'Creating...' : 'Create Batch'}
          </button>
        </form>
      </div>
      <div className="bg-surface-1 border border-white/8 rounded-2xl overflow-hidden">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-white/8">
            <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase">Name</th>
            <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase">Course</th>
            <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase">Time</th>
            <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase">Students</th>
          </tr></thead>
          <tbody>
            {batches.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-slate-400">No batches found.</td></tr>}
            {batches.map(b => (
              <tr key={b.id} className="border-b border-white/8">
                <td className="py-3 px-4 font-semibold text-white/80">{b.name}</td>
                <td className="py-3 px-4 text-slate-400">{b.course?.name}</td>
                <td className="py-3 px-4 text-slate-400">{b.startTime} - {b.endTime}</td>
                <td className="py-3 px-4 text-slate-400">{b._count.students}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBatches;
