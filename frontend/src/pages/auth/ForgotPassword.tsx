import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import logger from '../../utils/logger';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data?.status === 'success') {
        setSuccess(true);
      }
    } catch (err: any) {
      logger.error('Forgot password link request failed', err);
      setError(err.response?.data?.message || 'Email not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-12 bg-white dark:bg-[#0F0F1A] overflow-hidden transition-colors">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-violet-600/15 blur-[110px] pointer-events-none -z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-orange-500/10 blur-[120px] pointer-events-none -z-0" />

      <div className="relative z-10 w-full max-w-md">
        <div className="p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#16162A]/80 backdrop-blur-xl shadow-premium">

          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow">
              <KeyRound className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">Recover <span className="text-gradient-brand">Password</span></h1>
            <p className="text-xs text-slate-500 dark:text-white/50">Provide email to retrieve your access credentials</p>
          </div>

          {success ? (
            <div className="text-center py-6 space-y-4">
              <p className="text-xs text-slate-500 dark:text-white/50 leading-relaxed">
                In production, a password reset link is mailed. For local development, look up the reset token in the backend logs and proceed to the reset screen.
              </p>
              <Link to="/auth/reset-password" className="btn-primary w-full justify-center text-xs py-2.5">
                Go to Reset Form
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-3.5 py-2.5 rounded-xl font-semibold">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white dark:bg-[#0F0F1A]/70 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                    placeholder="name@email.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Request Recovery Token</span>
                )}
              </button>
            </form>
          )}

          <div className="text-center">
            <Link to="/auth/login" className="text-xs font-bold text-slate-500 dark:text-white/50 hover:text-violet-500 dark:hover:text-violet-400 flex items-center justify-center gap-1.5 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Log In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
