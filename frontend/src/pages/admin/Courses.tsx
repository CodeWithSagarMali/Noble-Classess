import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { BookOpen, Plus } from 'lucide-react';
import logger from '../../utils/logger';

interface Course {
  id: string;
  name: string;
  description: string;
  durationMonths: number;
  baseFee: number;
  isActive: boolean;
}

export const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', durationMonths: '', baseFee: '', syllabusLink: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/admin/courses');
      setCourses(res.data.data || []);
    } catch (err) {
      logger.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/courses', form);
      setForm({ name: '', description: '', durationMonths: '', baseFee: '', syllabusLink: '' });
      fetchCourses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create course.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-brand-rose border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Manage Courses</h1>
      <div className="bg-surface-1 border border-white/8 rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-sm text-white/80">Create New Course</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" placeholder="Course Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose" />
          <input type="number" placeholder="Duration (months)" value={form.durationMonths} onChange={e => setForm({ ...form, durationMonths: e.target.value })} required className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose" />
          <input type="number" placeholder="Base Fee (₹)" value={form.baseFee} onChange={e => setForm({ ...form, baseFee: e.target.value })} required className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose" />
          <input type="text" placeholder="Syllabus Link (optional)" value={form.syllabusLink} onChange={e => setForm({ ...form, syllabusLink: e.target.value })} className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose" />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="sm:col-span-2 w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose resize-none" />
          <button type="submit" disabled={submitting} className="sm:col-span-2 flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-rose to-brand-orange hover:from-brand-rose-dark hover:to-brand-orange-dark text-white text-xs font-bold rounded-xl disabled:opacity-50">
            <Plus className="w-4 h-4" /> {submitting ? 'Creating...' : 'Create Course'}
          </button>
        </form>
      </div>
      <div className="bg-surface-1 border border-white/8 rounded-2xl overflow-hidden">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-white/8">
            <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase">Name</th>
            <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase">Duration</th>
            <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase">Fee</th>
            <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase">Status</th>
          </tr></thead>
          <tbody>
            {courses.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-slate-400">No courses found.</td></tr>}
            {courses.map(c => (
              <tr key={c.id} className="border-b border-white/8">
                <td className="py-3 px-4 font-semibold text-white/80">{c.name}</td>
                <td className="py-3 px-4 text-slate-400">{c.durationMonths} months</td>
                <td className="py-3 px-4 text-slate-400">₹{c.baseFee.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.isActive ? 'bg-green-500/10 text-green-600' : 'bg-slate-500/10 text-slate-500'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCourses;
