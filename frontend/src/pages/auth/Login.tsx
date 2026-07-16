import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, LogIn, Lock, Mail, ShieldCheck, Users, BookOpen } from 'lucide-react';
import logger from '../../utils/logger';

const roles = [
  { icon: ShieldCheck, label: 'Admin', desc: 'Manage the institute' },
  { icon: Users, label: 'Teacher', desc: 'Classes & tests' },
  { icon: BookOpen, label: 'Student', desc: 'Learn & practice' },
];

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSessionExpired = searchParams.get('expired') === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login(email, password);
      // Role redirection
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'TEACHER') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    } catch (err: any) {
      logger.error('Login failed', err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 bg-white dark:bg-[#0F0F1A] overflow-hidden transition-colors">
      {/* Brand glow background — matches home hero */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-violet-600/15 blur-[110px] pointer-events-none -z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-orange-500/10 blur-[120px] pointer-events-none -z-0" />

      <div className="relative z-10 w-full max-w-md">
        <div className="p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#16162A]/80 backdrop-blur-xl shadow-premium">

          {/* Header Title */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
              Welcome to <span className="text-gradient-brand">Noble Classes</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-white/50">Sign in to your student, teacher, or admin portal</p>
          </div>

          {/* Role hints */}
          <div className="grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <div
                key={r.label}
                className="flex flex-col items-center gap-1 py-3 rounded-xl border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/[0.03]"
              >
                <r.icon className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                <span className="text-[11px] font-bold text-slate-700 dark:text-white/80">{r.label}</span>
              </div>
            ))}
          </div>

          {isSessionExpired && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] px-3.5 py-2.5 rounded-xl font-semibold">
              Your login session has expired. Please authenticate again.
            </div>
          )}

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-3.5 py-2.5 rounded-xl font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">Password</label>
                <Link to="/auth/forgot-password" className="text-[10px] font-bold text-violet-600 dark:text-violet-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white dark:bg-[#0F0F1A]/70 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                  placeholder="••••••••"
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
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Log In Securely</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 dark:text-white/50">
              Aspirant seeking admissions?{' '}
              <Link to="/auth/register" className="font-bold text-violet-600 dark:text-violet-400 hover:underline">
                Create an account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
