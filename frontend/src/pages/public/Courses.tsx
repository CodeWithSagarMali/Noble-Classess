import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import api from '../../services/api';
import {
  BookOpen, Calendar, Download, Search, Filter, ArrowRight,
  Star, Users, Clock, ChevronRight, Calculator, Microscope,
  FlaskConical, Trophy, CheckCircle, Flame, Zap
} from 'lucide-react';

interface CourseData {
  id: string;
  name: string;
  description: string;
  durationMonths: number;
  baseFee: number;
  syllabusLink?: string;
  isActive: boolean;
}

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

const courseIcons: Record<string, any> = {
  'jee': Calculator,
  'neet': Microscope,
  'foundation': FlaskConical,
  'board': BookOpen,
};

const streamFilters = ['All', 'Engineering', 'Medical', 'Foundation', 'Board'];

const enhancedFallback = [
  {
    id: '1', name: 'IIT-JEE Ultimate Prep', stream: 'Engineering',
    description: 'Rigorous engineering entrance coaching covering mechanics, electromagnetism, chemical reactions, complex algebra, and calculus.',
    durationMonths: 24, baseFee: 120000, syllabusLink: '#', isActive: true,
    rating: 4.9, students: '6,200+', highlights: ['Daily Live Classes', '50K+ MCQs', 'Rank Guarantee'],
    badge: 'Most Popular', badgeColor: 'badge-orange', iconKey: 'jee',
    color: 'from-violet-600/20 to-purple-900/5', border: 'border-violet-500/20', accent: 'text-violet-400',
    tags: ['Physics', 'Chemistry', 'Maths', 'JEE Main', 'JEE Advanced'],
  },
  {
    id: '2', name: 'NEET Excellence Course', stream: 'Medical',
    description: 'Comprehensive medical entrance coaching mapping biological structures, anatomy, genetics, organic chemistry, and molecular physics.',
    durationMonths: 24, baseFee: 110000, syllabusLink: '#', isActive: true,
    rating: 4.8, students: '5,100+', highlights: ['NEET Pattern MCQs', 'Biology Deep Dive', 'Anatomy Charts'],
    badge: 'High Success Rate', badgeColor: 'badge-green', iconKey: 'neet',
    color: 'from-cyan-600/15 to-blue-900/5', border: 'border-cyan-500/20', accent: 'text-cyan-400',
    tags: ['Biology', 'Zoology', 'Botany', 'Chemistry', 'Physics'],
  },
  {
    id: '3', name: 'Class 10 Foundation', stream: 'Foundation',
    description: 'Foundation courses strengthening conceptual core in Science and Maths for boards, combined with Olympiad preparation.',
    durationMonths: 12, baseFee: 45000, syllabusLink: '#', isActive: true,
    rating: 4.7, students: '3,800+', highlights: ['CBSE Aligned', 'Olympiad Prep', 'Board Pattern Tests'],
    badge: 'Beginner Friendly', badgeColor: 'badge-violet', iconKey: 'foundation',
    color: 'from-orange-600/15 to-amber-900/5', border: 'border-orange-500/20', accent: 'text-orange-400',
    tags: ['Science', 'Mathematics', 'English', 'SST', 'Olympiad'],
  },
];

export const Courses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/admin/courses');
        if (res.data?.status === 'success' && res.data.data?.length > 0) {
          setCourses(res.data.data);
        } else {
          setCourses(enhancedFallback);
        }
      } catch {
        setCourses(enhancedFallback);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filtered = courses.filter((c: any) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                        (c.description || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All' || c.stream === activeFilter;
    return matchSearch && matchFilter;
  });

  const getIcon = (c: any) => {
    const key = c.iconKey || (c.name?.toLowerCase().includes('jee') ? 'jee' : c.name?.toLowerCase().includes('neet') ? 'neet' : 'foundation');
    return courseIcons[key] || BookOpen;
  };

  return (
    <div className="dark:bg-[#0F0F1A] bg-white dark:text-white text-slate-900 min-h-screen">

      {/* Hero Section */}
      <section className="relative dark:bg-[#0F0F1A] bg-slate-50 border-b dark:border-white/8 border-slate-200 py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-violet-600/8 blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-orange-500/6 blur-[80px]" />
        </div>
        <div className="container-xl relative z-10">
          <FadeIn className="text-center space-y-6 max-w-3xl mx-auto">
            <span className="badge-violet">Academic Programs 2025–26</span>
            <h1 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight">
              Choose Your Path to
              <span className="text-gradient-brand"> Academic Excellence</span>
            </h1>
            <p className="text-sm md:text-base dark:text-white/50 text-slate-500 leading-relaxed">
              Comprehensive courses designed by PhD faculty and ex-IIT toppers. Every course features 
              live classes, MCQ engine, digital notes, and performance analytics.
            </p>

            {/* Search bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 dark:text-white/30 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="w-full dark:bg-white/6 bg-white border dark:border-white/10 border-slate-200 dark:text-white text-slate-900 dark:placeholder:text-white/30 placeholder:text-slate-400 text-sm pl-11 pr-4 py-3 rounded-2xl outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="container-xl py-14 space-y-10">
        
        {/* Filter Pills */}
        <FadeIn className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 dark:text-white/40 text-slate-400 mr-1" />
          {streamFilters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeFilter === f
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'dark:bg-white/6 bg-slate-100 dark:text-white/60 text-slate-500 dark:hover:bg-white/10 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </FadeIn>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[480px] rounded-3xl dark:bg-white/4 bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <BookOpen className="w-12 h-12 dark:text-white/20 text-slate-300 mx-auto" />
            <p className="text-sm dark:text-white/40 text-slate-500">No courses found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course: any, i) => {
              const Icon = getIcon(course);
              return (
                <FadeIn key={course.id} delay={i * 0.1}>
                  <div className={`relative group overflow-hidden rounded-3xl border flex flex-col h-full transition-all duration-300 hover:-translate-y-1 dark:bg-[#1E1E35] bg-white ${course.border || 'dark:border-white/8 border-slate-200'} hover:shadow-xl dark:hover:shadow-violet-900/30`}>
                    
                    {/* Top gradient strip */}
                    <div className={`h-1 w-full bg-gradient-to-r ${course.color?.replace('/20', '') || 'from-violet-600 to-purple-600'} opacity-80`} />

                    <div className="p-6 flex flex-col flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 rounded-2xl dark:bg-white/8 bg-slate-100 flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${course.accent || 'text-violet-400'}`} />
                        </div>
                        {course.badge && <span className={course.badgeColor || 'badge-violet'}>{course.badge}</span>}
                      </div>

                      {/* Info */}
                      <div className="space-y-2 flex-1">
                        <p className="text-[10px] font-bold dark:text-white/30 text-slate-400 uppercase tracking-widest">{course.stream || 'Course'}</p>
                        <h2 className="text-xl font-bold dark:text-white text-slate-900">{course.name}</h2>
                        <p className="text-sm dark:text-white/50 text-slate-500 leading-relaxed">{course.description}</p>
                      </div>

                      {/* Highlights */}
                      {course.highlights && (
                        <div className="space-y-2">
                          {course.highlights.map((h: string) => (
                            <div key={h} className="flex items-center gap-2 text-xs dark:text-white/60 text-slate-600">
                              <CheckCircle className={`w-3.5 h-3.5 ${course.accent || 'text-violet-400'}`} />
                              {h}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tags */}
                      {course.tags && (
                        <div className="flex flex-wrap gap-1.5">
                          {course.tags.slice(0, 4).map((t: string) => (
                            <span key={t} className="text-[10px] font-semibold px-2.5 py-1 rounded-full dark:bg-white/6 bg-slate-100 dark:text-white/50 text-slate-500">
                              {t}
                            </span>
                          ))}
                          {course.tags.length > 4 && (
                            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full dark:bg-white/6 bg-slate-100 dark:text-white/30 text-slate-400">
                              +{course.tags.length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-y dark:border-white/8 border-slate-100">
                        <div className="text-center">
                          <p className="text-xs font-bold dark:text-white text-slate-900">{course.durationMonths}M</p>
                          <p className="text-[9px] dark:text-white/30 text-slate-400 uppercase tracking-wider">Duration</p>
                        </div>
                        <div className="text-center border-x dark:border-white/8 border-slate-100">
                          <div className="flex items-center justify-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <p className="text-xs font-bold dark:text-white text-slate-900">{course.rating || '4.8'}</p>
                          </div>
                          <p className="text-[9px] dark:text-white/30 text-slate-400 uppercase tracking-wider">Rating</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold dark:text-white text-slate-900">{course.students || '1K+'}</p>
                          <p className="text-[9px] dark:text-white/30 text-slate-400 uppercase tracking-wider">Students</p>
                        </div>
                      </div>

                      {/* Price + CTA */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] dark:text-white/30 text-slate-400 font-bold uppercase">Fee Per Year</p>
                          <p className={`text-lg font-extrabold ${course.accent || 'text-violet-400'}`}>
                            ₹{course.baseFee.toLocaleString('en-IN')}
                          </p>
                        </div>
                        {course.syllabusLink && (
                          <a
                            href={course.syllabusLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs dark:text-white/40 text-slate-400 hover:text-violet-400 font-semibold transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Syllabus PDF
                          </a>
                        )}
                      </div>

                      <Link
                        to="/admission"
                        className="btn-primary w-full justify-center mt-2"
                      >
                        <Flame className="w-4 h-4" />
                        Apply Online Now
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        )}
      </section>

      {/* Why Choose Noble — Bottom Banner */}
      <section className="dark:bg-[#16162A] bg-slate-50 border-t dark:border-white/8 border-slate-200 py-16 md:py-20">
        <div className="container-xl">
          <FadeIn className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, label: 'Instant Admission', desc: 'Complete online enrollment in under 10 minutes', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              { icon: Trophy, label: 'Proven Results', desc: '3,200+ selections in JEE & NEET in past 5 years', color: 'text-violet-400', bg: 'bg-violet-500/10' },
              { icon: Users, label: 'Expert Faculty', desc: '80+ PhD-qualified and ex-IIT mentors', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 dark:bg-[#1E1E35] bg-white p-5 rounded-2xl border dark:border-white/8 border-slate-200">
                <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center shrink-0`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <p className="font-bold dark:text-white text-slate-900 text-sm">{item.label}</p>
                  <p className="text-xs dark:text-white/40 text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>

    </div>
  );
};

export default Courses;
