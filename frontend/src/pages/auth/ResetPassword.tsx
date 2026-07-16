import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Lock, ShieldCheck, ArrowLeft } from 'lucide-react';
import logger from '../../utils/logger';

export const ResetPassword: React.FC = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/reset-password', { token, newPassword });
      if (res.data?.status === 'success') setSuccess(true);
    } catch (err: any) {
      logger.error('Reset password failed', err);
      setError(err.response?.data?.message || 'Invalid or expired reset token.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#0F0F1A]/70 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all";
  const inputWithIcon = "w-full bg-white dark:bg-[#0F0F1A]/70 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all";

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-12 bg-white dark:bg-[#0F0F1A] overflow-hidden transition-colors">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-violet-600/15 blur-[110px] pointer-events-none -z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-orange-500/10 blur-[120px] pointer-events-none -z-0" />

      <div className="relative z-10 w-full max-w-md">
        <div className="p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#16162A]/80 backdrop-blur-xl shadow-premium">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">Reset Your <span className="text-gradient-brand">Password</span></h1>
            <p className="text-xs text-slate-500 dark:text-white/50">Paste the token from your email / server log</p>
          </div>

          {success ? (
            <div className="text-center py-6 space-y-4">
              <p className="text-sm font-bold text-green-500">Password updated successfully!</p>
              <Link to="/auth/login" className="btn-primary w-full justify-center text-xs py-2.5">
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-3.5 py-2.5 rounded-xl font-semibold">{error}</div>}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">Reset Token</label>
                <input type="text" required value={token} onChange={e => setToken(e.target.value)}
                  className={inputClass}
                  placeholder="Paste token from server log" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                  <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    className={inputWithIcon}
                    placeholder="New password" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                  <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    className={inputWithIcon}
                    placeholder="Confirm password" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Update Password'}
              </button>
            </form>
          )}

          <div className="text-center">
            <Link to="/auth/login" className="text-xs font-bold text-slate-500 dark:text-white/50 hover:text-violet-500 dark:hover:text-violet-400 flex items-center justify-center gap-1.5 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
