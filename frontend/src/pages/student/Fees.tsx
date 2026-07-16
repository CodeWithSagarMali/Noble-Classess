import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { CreditCard, Download, AlertCircle } from 'lucide-react';
import logger from '../../utils/logger';

interface PaymentRecord {
  id: string;
  amount: number;
  status: string;
  type: string;
  dueDate: string;
  paidAt?: string;
  invoiceUrl?: string;
  student?: { firstName: string; lastName: string; rollNumber: string };
}

export const StudentFees: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/fees/list');
        setPayments(res.data.data || []);
      } catch (err) {
        logger.error('Failed to load fees', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handlePay = async (paymentId: string) => {
    setPayingId(paymentId);
    try {
      const orderRes = await api.post('/fees/order', { paymentId });
      const { order } = orderRes.data;
      const verifyRes = await api.post('/fees/verify', {
        paymentId,
        razorpayOrderId: order.id,
        razorpayPaymentId: `pay_mock_${Date.now()}`,
        razorpaySignature: '',
      });
      if (verifyRes.data?.status === 'success') {
        setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'PAID', paidAt: new Date().toISOString(), invoiceUrl: verifyRes.data.invoiceUrl } : p));
        alert('Payment successful!');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Payment failed.');
    } finally {
      setPayingId(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-brand-rose border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Fee Payments</h1>
      <div className="bg-surface-1 border border-white/8 rounded-2xl overflow-hidden">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-white/8">
            <th className="text-left py-3 px-4 font-bold text-white/50 uppercase">Type</th>
            <th className="text-left py-3 px-4 font-bold text-white/50 uppercase">Amount</th>
            <th className="text-left py-3 px-4 font-bold text-white/50 uppercase">Due Date</th>
            <th className="text-left py-3 px-4 font-bold text-white/50 uppercase">Status</th>
            <th className="text-left py-3 px-4 font-bold text-white/50 uppercase">Action</th>
          </tr></thead>
          <tbody>
            {payments.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-white/50">No fee records found.</td></tr>}
            {payments.map(p => (
              <tr key={p.id} className="border-b border-white/8">
                <td className="py-3 px-4 font-semibold text-white/90">{p.type} Fee</td>
                <td className="py-3 px-4 font-bold">₹{p.amount.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 text-white/50">{new Date(p.dueDate).toLocaleDateString()}</td>
                <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === 'PAID' ? 'bg-green-500/10 text-green-600' : 'bg-brand-rose/10 text-brand-rose'}`}>{p.status}</span></td>
                <td className="py-3 px-4">
                  {p.status === 'PENDING' ? (
                    <button onClick={() => handlePay(p.id)} disabled={payingId === p.id} className="px-3 py-1.5 bg-gradient-to-r from-brand-rose to-brand-orange text-white rounded-lg text-[10px] font-bold hover:from-brand-rose-dark hover:to-brand-orange-dark disabled:opacity-50">
                      {payingId === p.id ? 'Processing...' : 'Pay Now'}
                    </button>
                  ) : p.invoiceUrl ? (
                    <a href={p.invoiceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-brand-rose hover:underline text-[10px] font-bold">
                      <Download className="w-3 h-3" /> Receipt
                    </a>
                  ) : (
                    <span className="text-white/50 text-[10px]">—</span>
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

export default StudentFees;
