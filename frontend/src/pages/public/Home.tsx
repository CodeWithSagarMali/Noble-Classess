import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  ArrowRight, Star, Zap, Users, Trophy, BookOpen, Target, Brain, 
  CheckCircle, Clock, Play, GraduationCap, TrendingUp, Award,
  ChevronRight, FlaskConical, Calculator, Microscope, Flame,
  MessageCircle, Quote
} from 'lucide-react';

// --- Animated Counter Component ---
const Counter: React.FC<{ end: number; suffix?: string; prefix?: string; duration?: number }> = ({
  end, suffix = '', prefix = '', duration = 2
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(end);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
};

// --- Fade-in Section Wrapper ---
const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = ''
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const stats = [
  { value: 15000, suffix: '+', label: 'Students Enrolled', icon: Users },
  { value: 3200, suffix: '+', label: 'Selections (JEE+NEET)', icon: Trophy },
  { value: 80, suffix: '+', label: 'PhD Expert Faculty', icon: GraduationCap },
  { value: 98, suffix: '%', label: 'Board Pass Rate', icon: TrendingUp },
];

const features = [
  {
    icon: Brain,
    title: 'Conceptual Learning',
    desc: 'Visual lectures and weekly deep-dives mapping to textbook principles — board prep that aligns with JEE/NEET criteria.',
    color: 'from-violet-500 to-purple-600',
    glow: 'rgba(124, 58, 237, 0.3)',
  },
  {
    icon: Target,
    title: 'Real-Time MCQ Engine',
    desc: 'NTA-mirror exam environment with negative marking, live timers, and comparative peer scorecard leaderboards.',
    color: 'from-orange-500 to-red-500',
    glow: 'rgba(249, 115, 22, 0.3)',
  },
  {
    icon: Award,
    title: 'PhD Mentor Advisory',
    desc: 'Direct interaction with PhD scientists and ex-IIT faculty — premium guidance, strategies and proven shortcuts.',
    color: 'from-cyan-500 to-blue-600',
    glow: 'rgba(6, 182, 212, 0.3)',
  },
  {
    icon: TrendingUp,
    title: 'Performance Analytics',
    desc: 'Detailed per-student analytics, subject-wise weak area identification, and adaptive practice plans.',
    color: 'from-green-500 to-emerald-600',
    glow: 'rgba(16, 185, 129, 0.3)',
  },
  {
    icon: BookOpen,
    title: 'Digital Study Library',
    desc: 'Comprehensive PDF notes, video summaries, and downloadable worksheets organized by chapter and difficulty.',
    color: 'from-pink-500 to-rose-600',
    glow: 'rgba(236, 72, 153, 0.3)',
  },
  {
    icon: Users,
    title: 'Parent Dashboard',
    desc: 'Real-time attendance reports, fee status, test scores and teacher feedback accessible to parents 24/7.',
    color: 'from-amber-500 to-yellow-600',
    glow: 'rgba(245, 158, 11, 0.3)',
  },
];

const courses = [
  {
    title: 'IIT-JEE Ultimate Prep',
    stream: 'Engineering',
    icon: Calculator,
    duration: '2 Years',
    fee: '₹1,20,000/yr',
    tags: ['Physics', 'Chemistry', 'Mathematics', 'MCQ Tests'],
    badge: 'Most Popular',
    badgeColor: 'badge-orange',
    rating: 4.9,
    students: '6,200+',
    desc: 'Rigorous coaching for JEE Main & Advanced. Focuses on analytical derivations, visual mechanics, and adaptive practice.',
    color: 'from-violet-500/20 to-purple-900/10',
    border: 'border-violet-500/25',
    accent: 'text-violet-400',
  },
  {
    title: 'NEET Excellence',
    stream: 'Medical',
    icon: Microscope,
    duration: '2 Years',
    fee: '₹1,10,000/yr',
    tags: ['Zoology', 'Botany', 'Organic Chemistry', 'Physics'],
    badge: 'High Success Rate',
    badgeColor: 'badge-green',
    rating: 4.8,
    students: '5,100+',
    desc: 'Deep medical entrance coaching with biological schematics, anatomy mastery, and MCQ bank of 50,000+ questions.',
    color: 'from-cyan-500/20 to-blue-900/10',
    border: 'border-cyan-500/25',
    accent: 'text-cyan-400',
  },
  {
    title: 'Class 10 Foundation',
    stream: 'Foundation',
    icon: FlaskConical,
    duration: '1 Year',
    fee: '₹45,000/yr',
    tags: ['Science', 'Mathematics', 'English', 'Olympiad'],
    badge: 'Beginner Friendly',
    badgeColor: 'badge-violet',
    rating: 4.7,
    students: '3,800+',
    desc: 'Build a strong conceptual core in Science and Maths for boards, combined with Olympiad preparation pathways.',
    color: 'from-orange-500/15 to-amber-900/10',
    border: 'border-orange-500/25',
    accent: 'text-orange-400',
  },
];

const testimonials = [
  {
    text: "The conceptual physics deep dives at Noble Classes were critical for my JEE prep. The online MCQ practice test portal mirrored the NTA environment exactly — I walked into the exam feeling fully prepared.",
    name: 'Aditya Sen',
    rank: 'IIT-JEE AIR 142',
    batch: 'Class of 2025',
    initials: 'AS',
    color: 'from-violet-600 to-purple-700',
  },
  {
    text: "Noble's biology faculty is exceptional. The visual diagrams and weekly NEET mock tests helped me understand anatomy in depth. My NEET score improved by 180 points in just 6 months.",
    name: 'Priya Sharma',
    rank: 'NEET AIR 567',
    batch: 'Class of 2025',
    initials: 'PS',
    color: 'from-cyan-600 to-blue-700',
  },
  {
    text: "The parent dashboard feature is brilliant. I could track my daughter's attendance, test scores and fee payments without calling the office. The transparency is what sets Noble apart.",
    name: 'Ramesh Gupta',
    rank: 'Parent of JEE Student',
    batch: '2024–25 Batch',
    initials: 'RG',
    color: 'from-orange-600 to-red-700',
  },
];

const checkItems = [
  'Expert PhD & ex-IIT Faculty',
  'NTA-Mirror MCQ Test Engine',
  'Real-time Attendance Reports',
  'Downloadable Study Materials',
  'Online Fee Payment Portal',
  'Dedicated Parent Dashboard',
];

export const Home: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="overflow-x-hidden bg-[#0F0F1A] text-white">

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center hero-bg overflow-hidden">
        {/* Decorative floating circles */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-violet-600/8 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-orange-500/6 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/4 blur-[120px] pointer-events-none" />

        <div className="container-xl relative z-10 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="space-y-7"
          >
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass border border-white/10"
            >
              <span className="flex items-center gap-1.5 text-xs font-bold text-green-400">
                <span className="live-dot" />
                LIVE BATCHES OPEN
              </span>
              <span className="w-px h-3.5 bg-white/20" />
              <span className="text-xs text-white/50 font-medium">Admissions 2025–26</span>
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display leading-tight tracking-tight">
                <span className="text-white">India's Premium</span>
                <br />
                <span className="text-gradient-brand">Coaching Platform</span>
                <br />
                <span className="text-white">for IIT-JEE & NEET</span>
              </h1>
              <p className="text-base md:text-lg text-white/50 leading-relaxed max-w-xl">
                State-of-the-art interactive learning, adaptive MCQ test engine mirroring NTA interface, 
                expert PhD faculty, and comprehensive analytics — all in one platform.
              </p>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {checkItems.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-white/60">
                  <CheckCircle className="w-4 h-4 text-violet-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/admission" className="btn-orange text-sm px-7 py-3.5">
                <Flame className="w-4 h-4" />
                Enroll Online Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/courses" className="btn-outline text-sm px-7 py-3.5">
                <Play className="w-4 h-4" />
                Explore Programs
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 pt-1">
              <div className="flex -space-x-2">
                {['AS', 'PS', 'RK', 'MV', 'SJ'].map((init, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#0F0F1A] flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: `hsl(${i * 60 + 260}, 70%, 50%)` }}
                  >
                    {init}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-white/80 ml-1">4.9</span>
                </div>
                <p className="text-[11px] text-white/40">Rated by 15,000+ students</p>
              </div>
            </div>
          </motion.div>

          {/* Right — Dashboard Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Main Card */}
            <div className="relative w-full max-w-sm">
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-orange-500/15 blur-[60px] rounded-3xl" />

              <div className="relative glass-card rounded-3xl p-5 space-y-4">
                {/* Top bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Rahul Sharma</p>
                      <p className="text-[10px] text-white/40">JEE Advanced 2025</p>
                    </div>
                  </div>
                  <span className="badge-green text-[9px]">AIR 142</span>
                </div>

                {/* Live test widget */}
                <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-violet-400">
                      <span className="live-dot" />
                      MCQ Test Live
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/50 font-medium">
                      <Clock className="w-3 h-3" />
                      44:59
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold text-white/80">
                    Q.14: A charged particle moving with constant velocity enters a uniform magnetic field perpendicularly. The radius of circular motion is...
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {['A. mv/qB', 'B. qB/mv', 'C. m/qvB', 'D. qv/mB'].map((opt, i) => (
                      <div
                        key={opt}
                        className={`text-[10px] font-semibold p-2 rounded-lg border transition-all ${
                          i === 0
                            ? 'border-violet-500 bg-violet-500/15 text-violet-300'
                            : 'border-white/8 text-white/40'
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-white/40">
                    <span>Question 14 / 90</span>
                    <span>Score: 36/52</span>
                  </div>
                </div>

                {/* Stat bar */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Attendance', value: '94%', color: 'text-green-400' },
                    { label: 'Rank', value: '#12', color: 'text-violet-400' },
                    { label: 'Tests', value: '42', color: 'text-orange-400' },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className={`text-sm font-extrabold ${s.color}`}>{s.value}</p>
                      <p className="text-[9px] text-white/35 uppercase tracking-wider">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating mini card — top right */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 glass rounded-2xl px-3 py-2 border border-green-500/20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Trophy className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-green-400">Top Ranker!</p>
                    <p className="text-[9px] text-white/40">Chapter Test #8</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating mini card — bottom left */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-4 glass rounded-2xl px-3 py-2 border border-orange-500/20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-orange-400">New Material</p>
                    <p className="text-[9px] text-white/40">Optics — Chapter 12</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="bg-[#16162A] border-y border-white/8">
        <div className="container-xl py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="stat-card text-white">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/15 to-orange-500/15 flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <p className="text-3xl md:text-4xl font-extrabold font-display">
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="bg-[#0F0F1A] py-20 md:py-28">
        <div className="container-xl">
          <FadeIn className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <span className="badge-violet">Why Noble Classes</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white">
              Everything You Need to
              <span className="text-gradient-brand"> Crack the Exam</span>
            </h2>
            <p className="text-sm text-white/50 leading-relaxed">
              Our platform combines the best of offline coaching and online technology — 
              delivering a premium, adaptive, and data-driven learning experience.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="card-premium p-6 space-y-4 group cursor-default h-full bg-[#1E1E35]/80 border border-white/8">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg`}
                    style={{ boxShadow: `0 8px 20px ${f.glow}` }}
                  >
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{f.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
                  <div className="flex items-center gap-1 text-xs font-semibold text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COURSES ===== */}
      <section className="bg-[#16162A] border-y border-white/8 py-20 md:py-28">
        <div className="container-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12">
            <FadeIn className="space-y-3">
              <span className="badge-orange">Academic Programs</span>
              <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white">
                Our Prep Specializations
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <Link
                to="/courses"
                className="flex items-center gap-1.5 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
              >
                View All Courses <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className={`relative overflow-hidden rounded-3xl p-6 flex flex-col h-full border border-white/8 bg-gradient-to-br ${course.color} dark:bg-transparent bg-white group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 course-card`}>
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 border border-white/10`}>
                      <course.icon className={`w-6 h-6 ${course.accent}`} />
                    </div>
                    <span className={course.badgeColor}>{course.badge}</span>
                  </div>

                   <div className="space-y-2 flex-1">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-wider">{course.stream}</p>
                    <h3 className="text-xl font-bold text-white">{course.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{course.desc}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/8 text-white/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-5 border-t border-white/8">
                    <div>
                      <p className="text-[10px] dark:text-white/30 text-slate-400 font-bold uppercase">Program Fee</p>
                      <p className={`text-sm font-extrabold ${course.accent}`}>{course.fee}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-white">{course.rating}</span>
                      </div>
                      <p className="text-[10px] text-white/30">{course.students} enrolled</p>
                    </div>
                  </div>

                  <Link
                    to="/admission"
                    className="mt-4 btn-primary w-full justify-center"
                  >
                    Enroll Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="bg-[#0F0F1A] py-20 md:py-28">
        <div className="container-xl">
          <FadeIn className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <span className="badge-violet">Student Stories</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white">
              Toppers Who <span className="text-gradient-brand">Trust Noble Classes</span>
            </h2>
          </FadeIn>

          <div className="relative max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              {testimonials.map((t, i) => (
                i === activeTestimonial && (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="glass-card rounded-3xl p-8 md:p-10 bg-[#1E1E35]/60 border border-white/8"
                  >
                    <Quote className="w-8 h-8 text-violet-400/40 mb-6" />
                    <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium italic">
                       "{t.text}"
                    </p>
                    <div className="flex items-center gap-4 mt-8">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                        {t.initials}
                      </div>
                      <div>
                        <p className="font-bold text-white">{t.name}</p>
                        <p className="text-xs text-white/40">{t.rank} · {t.batch}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeTestimonial ? 'w-8 bg-violet-500' : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-16 md:py-20">
        <div className="container-xl">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl p-8 md:p-14">
              {/* Gradient bg */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-700 via-violet-800 to-purple-900" />
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(249,115,22,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(124,58,237,0.5) 0%, transparent 40%)'
              }} />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-xl">
                  <span className="badge-orange">Start Your Journey Today</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white">
                    Ready to Crack IIT-JEE or NEET in 2026?
                  </h2>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Join 15,000+ students already enrolled. Our next batch starts soon — 
                    secure your seat with our simple online admission process.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <MessageCircle className="w-5 h-5 text-white/60" />
                    <span className="text-sm text-white/60">Questions? Call us at <strong className="text-white">+91 98765 43210</strong></span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <Link to="/admission" className="btn-orange px-8 py-4 text-sm">
                    <Flame className="w-4 h-4" />
                    Enroll Online Now
                  </Link>
                  <Link to="/contact" className="btn-ghost px-8 py-4 text-sm border border-white/20">
                    Talk to Counselor
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
};

export default Home;
