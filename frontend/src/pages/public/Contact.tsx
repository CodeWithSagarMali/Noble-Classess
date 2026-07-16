import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import api from '../../services/api';
import {
  Mail, Phone, MapPin, Send, CheckCircle2, Clock, MessageSquare,
  Facebook, Twitter, Instagram, Linkedin, ArrowRight
} from 'lucide-react';
import logger from '../../utils/logger';

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = ''
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const contactInfo = [
  {
    icon: MapPin,
    title: 'Main Campus',
    lines: ['4th Floor, Royal Plaza Building,', 'Opp. MG Road Bus Stand,', 'Pune, Maharashtra — 411001'],
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Phone,
    title: 'Phone & WhatsApp',
    lines: ['+91 98765 43210', '+91 98765 43211 (Admissions)'],
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['support@nobleclasses.com', 'admissions@nobleclasses.com'],
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    lines: ['Mon–Sat: 8:00 AM – 8:00 PM', 'Sunday: 10:00 AM – 4:00 PM'],
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
];

const subjects = ['Admission Enquiry', 'Fee Installment Request', 'Batch Timing Query', 'Study Material Access', 'Scholarship Enquiry', 'Technical Support', 'Other'];

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await api.post('/cms/contact', formData);
      if (res.data?.status === 'success') {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err: any) {
      logger.error('Failed to submit enquiry form', err);
      setError(err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-[#0F0F1A] bg-white dark:text-white text-slate-900 min-h-screen">

      {/* Hero */}
      <section className="relative dark:bg-[#0F0F1A] bg-slate-50 border-b dark:border-white/8 border-slate-200 py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-violet-600/8 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-orange-500/6 blur-[80px] pointer-events-none" />
        <div className="container-xl relative z-10">
          <FadeIn className="text-center space-y-5 max-w-2xl mx-auto">
            <span className="badge-violet">
              <MessageSquare className="w-3 h-3" />
              We're Here to Help
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight">
              Contact Our
              <span className="text-gradient-brand"> Admissions Team</span>
            </h1>
            <p className="text-sm md:text-base dark:text-white/50 text-slate-500 leading-relaxed">
              Have questions about batch timings, scholarships, fee installments or course selection? 
              Our counselors respond within 24 hours.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-xl py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left — Info Cards */}
          <div className="lg:col-span-2 space-y-5">
            <FadeIn>
              <h2 className="text-xl font-bold dark:text-white text-slate-900 mb-6">Reach Us Directly</h2>
            </FadeIn>
            {contactInfo.map((info, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex items-start gap-4 dark:bg-[#1E1E35] bg-slate-50 p-5 rounded-2xl border dark:border-white/8 border-slate-200">
                  <div className={`w-11 h-11 rounded-xl ${info.bg} flex items-center justify-center shrink-0`}>
                    <info.icon className={`w-5 h-5 ${info.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold dark:text-white text-slate-900 mb-1">{info.title}</p>
                    {info.lines.map((line, j) => (
                      <p key={j} className="text-xs dark:text-white/50 text-slate-500 leading-relaxed">{line}</p>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}

            {/* Social Links */}
            <FadeIn delay={0.4}>
              <div className="dark:bg-[#1E1E35] bg-slate-50 p-5 rounded-2xl border dark:border-white/8 border-slate-200">
                <p className="text-sm font-bold dark:text-white text-slate-900 mb-4">Follow Us</p>
                <div className="flex items-center gap-3">
                  {[
                    { icon: Facebook, href: 'https://facebook.com', color: 'hover:bg-blue-600' },
                    { icon: Twitter, href: 'https://twitter.com', color: 'hover:bg-sky-500' },
                    { icon: Instagram, href: 'https://instagram.com', color: 'hover:bg-pink-600' },
                    { icon: Linkedin, href: 'https://linkedin.com', color: 'hover:bg-blue-700' },
                  ].map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-9 h-9 rounded-xl dark:bg-white/8 bg-slate-100 flex items-center justify-center ${s.color} transition-all duration-200 dark:text-white/50 text-slate-400 dark:hover:text-white hover:text-white`}
                    >
                      <s.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Map */}
            <FadeIn delay={0.5}>
              <div className="rounded-2xl overflow-hidden border dark:border-white/8 border-slate-200 h-48 shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.381398724103!2d73.87413647614532!3d18.5116773825838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c045b85a3c2b%3A0xe54d92ebc9ecad06!2sMG%20Road%2C%20Camp%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Noble Classes Location Map"
                />
              </div>
            </FadeIn>
          </div>

          {/* Right — Form */}
          <FadeIn delay={0.2} className="lg:col-span-3">
            <div className="dark:bg-[#1E1E35] bg-white rounded-3xl border dark:border-white/8 border-slate-200 p-8 shadow-2xl dark:shadow-black/30">
              
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-14 space-y-5"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold dark:text-white text-slate-900">Enquiry Submitted!</h3>
                  <p className="text-sm dark:text-white/50 text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. A coaching counselor will contact you within 24 working hours via email or phone.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="btn-outline text-sm px-6 py-2.5 mt-2"
                  >
                    Submit Another Enquiry <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-bold dark:text-white text-slate-900">Send a Message</h2>
                    <p className="text-sm dark:text-white/40 text-slate-500 mt-1">Fill out the form and we'll get back to you soon.</p>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl font-semibold">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold dark:text-white/50 text-slate-500 uppercase tracking-wider">Full Name *</label>
                      <input
                        type="text" name="name" required value={formData.name} onChange={handleChange}
                        className="input-dark dark:bg-white/4 bg-slate-50 dark:text-white text-slate-900 dark:border-white/8 border-slate-200 dark:placeholder:text-white/25 placeholder:text-slate-400"
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold dark:text-white/50 text-slate-500 uppercase tracking-wider">Phone *</label>
                      <input
                        type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                        className="input-dark dark:bg-white/4 bg-slate-50 dark:text-white text-slate-900 dark:border-white/8 border-slate-200 dark:placeholder:text-white/25 placeholder:text-slate-400"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold dark:text-white/50 text-slate-500 uppercase tracking-wider">Email Address *</label>
                    <input
                      type="email" name="email" required value={formData.email} onChange={handleChange}
                      className="input-dark dark:bg-white/4 bg-slate-50 dark:text-white text-slate-900 dark:border-white/8 border-slate-200 dark:placeholder:text-white/25 placeholder:text-slate-400"
                      placeholder="name@email.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold dark:text-white/50 text-slate-500 uppercase tracking-wider">Subject *</label>
                    <select
                      name="subject" required value={formData.subject} onChange={handleChange}
                      className="input-dark dark:bg-white/4 bg-slate-50 dark:text-white text-slate-900 dark:border-white/8 border-slate-200 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select your enquiry type...</option>
                      {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold dark:text-white/50 text-slate-500 uppercase tracking-wider">Message *</label>
                    <textarea
                      name="message" required rows={5} value={formData.message} onChange={handleChange}
                      className="input-dark dark:bg-white/4 bg-slate-50 dark:text-white text-slate-900 dark:border-white/8 border-slate-200 dark:placeholder:text-white/25 placeholder:text-slate-400 resize-none"
                      placeholder="Describe your query in detail — batch timings, fee structure, scholarship criteria..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center py-3.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
};

export default Contact;
