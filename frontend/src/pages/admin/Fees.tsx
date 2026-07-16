import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { CreditCard, Plus, Download } from 'lucide-react';
import logger from '../../utils/logger';

interface PaymentRecord {
  id: string;
  amount: number;
  status: string;
  type: string;
  mode: string;
  dueDate: string;
  paidAt?: string;
  transactionRef?: string;
  invoiceUrl?: string;
  student: { firstName: string; lastName: string; rollNumber: string };
}

export const AdminFees: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOfflineForm, setShowOfflineForm] = useState(false);
  const [offlineForm, setOfflineForm] = useState({ studentId: '', amount: '', type: 'TUITION', transactionRef: '', dueDate: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/fees/list');
      setPayments(res.data.data || []);
    } catch (err) {
      logger.error('Failed to load payments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleOfflinePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/fees/offline', offlineForm);
      setOfflineForm({ studentId: '', amount: '', type: 'TUITION', transactionRef: '', dueDate: '' });
      setShowOfflineForm(false);
      fetchPayments();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add offline payment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Offline Fee Receipts</h1>
        <button onClick={() => setShowOfflineForm(!showOfflineForm)} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700">
          <Plus className="w-4 h-4" /> Offline Payment
        </button>
      </div>

      {showOfflineForm && (
        <form onSubmit={handleOfflinePayment} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-sm text-slate-700 dark:text-slate-200">Record Offline Payment</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Student Profile ID" value={offlineForm.studentId} onChange={e => setOfflineForm({ ...offlineForm, studentId: e.target.value })} required className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-teal-500" />
            <input type="number" placeholder="Amount (₹)" value={offlineForm.amount} onChange={e => setOfflineForm({ ...offlineForm, amount: e.target.value })} required className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-teal-500" />
            <select value={offlineForm.type} onChange={e => setOfflineForm({ ...offlineForm, type: e.target.value })} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-teal-500">
              <option value="TUITION">Tuition</option>
              <option value="ADMISSION">Admission</option>
              <option value="EXAM">Exam</option>
              <option value="OTHER">Other</option>
            </select>
            <input type="text" placeholder="Transaction Ref (optional)" value={offlineForm.transactionRef} onChange={e => setOfflineForm({ ...offlineForm, transactionRef: e.target.value })} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-teal-500" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save Receipt'}
            </button>
            <button type="button" onClick={() => setShowOfflineForm(false)} className="px-6 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-slate-100 dark:border-slate-800">
            <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase">Student</th>
            <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase">Type</th>
            <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase">Amount</th>
            <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase">Mode</th>
            <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase">Status</th>
            <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase">Receipt</th>
          </tr></thead>
          <tbody>
            {payments.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-slate-400">No fee records found.</td></tr>}
            {payments.map(p => (
              <tr key={p.id} className="border-b border-slate-50 dark:border-slate-900">
                <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">{p.student?.firstName} {p.student?.lastName}</td>
                <td className="py-3 px-4 text-slate-400">{p.type}</td>
                <td className="py-3 px-4 font-bold">₹{p.amount.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 text-slate-400">{p.mode}</td>
                <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === 'PAID' ? 'bg-green-500/10 text-green-600' : 'bg-rose-500/10 text-rose-500'}`}>{p.status}</span></td>
                <td className="py-3 px-4">
                  {p.invoiceUrl ? (
                    <a href={p.invoiceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-teal-600 hover:underline text-[10px] font-bold">
                      <Download className="w-3 h-3" /> PDF
                    </a>
                  ) : (
                    <span className="text-slate-400 text-[10px]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFees;
