import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin,
  Youtube, MessageCircle, GraduationCap, ArrowRight, ExternalLink,
  Shield, FileText, RotateCcw
} from 'lucide-react';

const footerLinks = {
  programs: [
    { label: 'IIT-JEE Ultimate Prep', to: '/courses' },
    { label: 'NEET Excellence', to: '/courses' },
    { label: 'Class 10 Foundation', to: '/courses' },
    { label: 'Board Preparation', to: '/courses' },
    { label: 'Online Test Series', to: '/courses' },
  ],
  institute: [
    { label: 'About Noble Classes', to: '/about' },
    { label: 'Our Faculty', to: '/faculty' },
    { label: 'Toppers Gallery', to: '/achievements' },
    { label: 'Photo Gallery', to: '/gallery' },
    { label: 'Careers', to: '/career' },
  ],
  support: [
    { label: 'Contact Us', to: '/contact' },
    { label: 'Online Admission', to: '/admission' },
    { label: 'Student Login', to: '/auth/login' },
    { label: 'Parent Portal', to: '/auth/login' },
    { label: 'Fee Payment', to: '/student/dashboard' },
  ],
};

const socials = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:bg-blue-600' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:bg-sky-500' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-400' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:bg-blue-700' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube', color: 'hover:bg-red-600' },
  { icon: MessageCircle, href: 'https://wa.me/919876543210', label: 'WhatsApp', color: 'hover:bg-green-600' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="dark:bg-[#0A0A15] bg-slate-950 text-white border-t dark:border-white/6 border-slate-800">

      {/* Main Grid */}
      <div className="container-xl pt-16 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-5">
          <Link to="/" className="flex items-center gap-2.5 w-fit group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-lg shadow-violet-900/50">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight">
              <span className="text-white">Noble</span>
              <span className="text-gradient-brand"> Classes</span>
            </span>
          </Link>

          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            Empowering students since 2012 with conceptual clarity, adaptive MCQ test engines, 
            and expert PhD coaching for IIT-JEE, NEET, and board exams.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm text-slate-400">
              <MapPin className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              <span>4th Floor, Royal Plaza, MG Road, Pune, Maharashtra — 411001</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Phone className="w-4 h-4 text-orange-400 shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>support@nobleclasses.com</span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-2 flex-wrap">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 ${s.color}`}
              >
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Programs */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Programs</h4>
          <ul className="space-y-3">
            {footerLinks.programs.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
                >
                  <ArrowRight className="w-3 h-3 text-violet-500 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Institute */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Institute</h4>
          <ul className="space-y-3">
            {footerLinks.institute.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
                >
                  <ArrowRight className="w-3 h-3 text-violet-500 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support + Newsletter */}
        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
                  >
                    <ArrowRight className="w-3 h-3 text-violet-500 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="p-4 rounded-2xl bg-white/4 border border-white/8">
            <p className="text-xs font-bold text-white mb-2">Get Updates</p>
            <p className="text-[11px] text-slate-400 mb-3">Exam alerts, batch news, scholarship info.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email..."
                className="flex-1 text-xs bg-white/6 border border-white/10 text-white placeholder:text-slate-500 px-3 py-2 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
              />
              <button
                type="submit"
                className="shrink-0 w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center hover:bg-violet-500 transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/6">
        <div className="container-xl py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Noble Classes Institute. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500 flex-wrap justify-center">
            <Link to="/privacy" className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
              <Shield className="w-3 h-3" /> Privacy Policy
            </Link>
            <Link to="/terms" className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
              <FileText className="w-3 h-3" /> Terms & Conditions
            </Link>
            <Link to="/refund" className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
              <RotateCcw className="w-3 h-3" /> Refund Policy
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
