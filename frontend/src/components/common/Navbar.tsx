import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sun, Moon, Menu, X, ChevronDown, GraduationCap, LogOut,
  User, BookOpen, Trophy, Users, Phone, MessageCircle,
  FlaskConical, Calculator, Microscope, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const programs = [
  { label: 'IIT-JEE Prep', icon: Calculator, desc: 'Physics, Chemistry, Maths', to: '/courses', badge: 'Popular' },
  { label: 'NEET Excellence', icon: Microscope, desc: 'Biology, Chemistry, Physics', to: '/courses', badge: 'Hot' },
  { label: 'Foundation (Class 10)', icon: FlaskConical, desc: 'Science & Maths', to: '/courses', badge: null },
  { label: 'Board Prep', icon: BookOpen, desc: 'All Subjects', to: '/courses', badge: null },
];

const quickLinks = [
  { label: 'Achievements', icon: Trophy, to: '/achievements' },
  { label: 'Faculty', icon: Users, to: '/faculty' },
  { label: 'Contact', icon: Phone, to: '/contact' },
];

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const dashboardRoute = !user ? '/auth/login'
    : user.role === 'ADMIN' ? '/admin/dashboard'
    : user.role === 'TEACHER' ? '/teacher/dashboard'
    : '/student/dashboard';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinkClass = (active = false) =>
    `text-sm font-medium transition-colors duration-200 ${active
      ? 'text-violet-400'
      : 'text-white/70 hover:text-white'
    }`;

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#0F0F1A]/95 backdrop-blur-xl border-b border-white/8 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}>
        <div className="container-xl">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-lg shadow-violet-900/50">
                <GraduationCap className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-display font-extrabold text-lg tracking-tight">
                <span className="text-white">Noble</span>
                <span className="text-gradient-brand"> Classes</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/" className={navLinkClass(location.pathname === '/')}>Home</Link>

              {/* Programs Mega Menu */}
              <div
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <button className={`flex items-center gap-1 ${navLinkClass()} py-2`}>
                  Programs
                  <ChevronDown className={`w-4 h-4 transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {megaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[520px]"
                    >
                      <div className="glass rounded-2xl border border-white/10 p-5 shadow-2xl shadow-black/50">
                        <p className="text-2xs font-bold text-violet-400 uppercase tracking-widest mb-4">Our Programs</p>
                        <div className="grid grid-cols-2 gap-2">
                          {programs.map((p) => (
                            <Link
                              key={p.label}
                              to={p.to}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                            >
                              <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                <p.icon className="w-4.5 h-4.5 text-violet-400" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">{p.label}</span>
                                  {p.badge && (
                                    <span className="badge-orange text-[9px] py-0.5">{p.badge}</span>
                                  )}
                                </div>
                                <p className="text-xs text-white/40 mt-0.5">{p.desc}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-white/8 mt-4 pt-4 flex gap-4">
                          {quickLinks.map((l) => (
                            <Link
                              key={l.label}
                              to={l.to}
                              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
                            >
                              <l.icon className="w-3.5 h-3.5" />
                              {l.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/courses" className={navLinkClass(location.pathname === '/courses')}>Courses</Link>
              <Link to="/contact" className={navLinkClass(location.pathname === '/contact')}>Contact</Link>
            </nav>

            {/* Desktop Right CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to={dashboardRoute}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/12 border border-white/10 text-sm font-medium text-white transition-all"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white text-[10px] font-bold">
                      {user.email[0].toUpperCase()}
                    </div>
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/auth/login"
                    className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/admission"
                    className="btn-orange text-xs px-5 py-2.5"
                  >
                    <Star className="w-3.5 h-3.5" />
                    Apply Now
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Triggers */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/8 transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-[#16162A] border-l border-white/8 flex flex-col lg:hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-white text-sm">Noble Classes</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {[
                  { label: 'Home', to: '/' },
                  { label: 'Courses & Programs', to: '/courses' },
                  { label: 'IIT-JEE Prep', to: '/courses' },
                  { label: 'NEET Excellence', to: '/courses' },
                  { label: 'Contact Us', to: '/contact' },
                ].map((link) => (
                  <Link
                    key={link.to + link.label}
                    to={link.to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/6 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Bottom CTAs */}
              <div className="p-4 border-t border-white/8 space-y-2">
                {user ? (
                  <>
                    <Link
                      to={dashboardRoute}
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-violet-600 text-white text-sm font-semibold"
                    >
                      <User className="w-4 h-4" />
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-red-500/30 text-red-400 text-sm font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/admission"
                      className="block w-full text-center py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold"
                    >
                      Apply Now
                    </Link>
                    <Link
                      to="/auth/login"
                      className="block w-full text-center py-2.5 px-4 rounded-xl border border-white/12 text-white/70 text-sm font-semibold"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
