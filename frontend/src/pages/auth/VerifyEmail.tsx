import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { MailCheck, CheckCircle2 } from 'lucide-react';
import logger from '../../utils/logger';

export const VerifyEmail: React.FC = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/verify-email', { token });
      if (res.data?.status === 'success') setSuccess(true);
    } catch (err: any) {
      logger.error('Email verification failed', err);
      setError(err.response?.data?.message || 'Invalid or expired verification token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-white dark:bg-slate-950">
      <div className="w-full max-w-md p-8 glass-panel border border-slate-200 dark:border-slate-800 rounded-3xl shadow-premium space-y-6">
        <div className="text-center space-y-2">
          <MailCheck className="h-10 w-10 text-teal-600 dark:text-teal-400 mx-auto" />
          <h1 className="text-2xl font-extrabold font-sans">Verify Your Email</h1>
          <p className="text-xs text-slate-500">Copy the token printed in the backend server log and paste it below</p>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto" />
            <p className="text-sm font-bold text-teal-600 dark:text-teal-400">Email verified successfully!</p>
            <Link to="/auth/login" className="block py-2.5 bg-teal-600 text-white font-semibold rounded-xl text-xs text-center">
              Proceed to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-3.5 py-2.5 rounded-xl font-semibold">{error}</div>}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Verification Token</label>
              <input type="text" required value={token} onChange={e => setToken(e.target.value)}
                className="w-full bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none font-mono"
                placeholder="Paste token from server console log" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl disabled:opacity-50 transition-colors">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Verify Email Address'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
