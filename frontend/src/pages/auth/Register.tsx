import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, UserPlus, Mail, Lock, User, Phone, CheckCircle2 } from 'lucide-react';
import logger from '../../utils/logger';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.phone
      );
      setSuccess(true);
    } catch (err: any) {
      logger.error('Registration failed', err);
      setError(err.response?.data?.message || 'Failed to complete registration. Email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#0F0F1A]/70 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all";

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-12 bg-white dark:bg-[#0F0F1A] overflow-hidden transition-colors">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-violet-600/15 blur-[110px] pointer-events-none -z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-orange-500/10 blur-[120px] pointer-events-none -z-0" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#16162A]/80 backdrop-blur-xl shadow-premium">

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">Aspirant <span className="text-gradient-brand">Registration</span></h1>
            <p className="text-xs text-slate-500 dark:text-white/50">Create an account to begin your online admission application</p>
          </div>

          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Registration Successful</h3>
              <p className="text-xs text-slate-500 dark:text-white/50 max-w-sm mx-auto leading-relaxed">
                Your account has been created. In production, a verification email is sent. For local dev, copy your token from the backend logs and paste it in the verification screen.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Link to="/auth/verify-email" className="btn-primary justify-center text-xs py-2.5">
                  Verify Email
                </Link>
                <Link to="/auth/login" className="btn-outline justify-center text-xs py-2.5">
                  Go to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-3.5 py-2.5 rounded-xl font-semibold">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Rahul"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Sharma"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="name@email.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">Contact Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="+919988776655"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Minimum 6 characters"
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
                    <UserPlus className="w-4 h-4" />
                    <span>Register Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 dark:text-white/50">
              Already have an account?{' '}
              <Link to="/auth/login" className="font-bold text-violet-600 dark:text-violet-400 hover:underline">
                Log in instead
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
