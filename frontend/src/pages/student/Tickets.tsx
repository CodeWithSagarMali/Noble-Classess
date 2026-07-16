import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { HelpCircle, Plus, X, MessageSquare } from 'lucide-react';
import logger from '../../utils/logger';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  replies: { id: string; message: string; createdAt: string; sender: { email: string; role: string } }[];
}

export const StudentTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets/list');
      setTickets(res.data.data || []);
    } catch (err) {
      logger.error('Failed to load tickets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/tickets/create', { subject, description, priority });
      setSubject(''); setDescription(''); setPriority('MEDIUM'); setShowForm(false);
      fetchTickets();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-brand-rose border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-white">Support Helpdesk</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-rose to-brand-orange text-white text-xs font-bold rounded-xl hover:from-brand-rose-dark hover:to-brand-orange-dark">
          <Plus className="w-4 h-4" /> New Ticket
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface-1 border border-white/8 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/50 uppercase">Subject</label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/50 uppercase">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-white/50 uppercase">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-rose resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-gradient-to-r from-brand-rose to-brand-orange text-white text-xs font-bold rounded-xl hover:from-brand-rose-dark hover:to-brand-orange-dark disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-white/8 rounded-xl text-xs font-bold hover:bg-white/5">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {tickets.length === 0 && <p className="text-xs text-white/50 text-center py-8">No support tickets yet.</p>}
        {tickets.map(t => (
          <div key={t.id} className="bg-surface-1 border border-white/8 rounded-2xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{t.subject}</h3>
                <p className="text-[10px] text-white/50 mt-1">{new Date(t.createdAt).toLocaleString()}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.status === 'OPEN' ? 'bg-amber-500/10 text-amber-600' : t.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-600' : 'bg-green-500/10 text-green-600'}`}>{t.status}</span>
            </div>
            <p className="text-xs text-white/50">{t.description}</p>
            {t.replies?.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/8">
                {t.replies.map(r => (
                  <div key={r.id} className="flex gap-2 text-xs">
                    <MessageSquare className="w-3 h-3 text-white/50 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-white/70">{r.sender.email}</span>
                      <span className="text-white/50 ml-2">{new Date(r.createdAt).toLocaleString()}</span>
                      <p className="text-white/50 mt-0.5">{r.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentTickets;
