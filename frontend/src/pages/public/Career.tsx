import React from 'react';
import { Briefcase, ArrowRight, Target, Mail } from 'lucide-react';

export const Career: React.FC = () => {
  const jobs = [
    { title: 'Senior Physics Faculty (JEE Advanced)', type: 'Full-Time | Pune Campus', desc: 'Seeking ex-IITians or PhD scholars with 5+ years experience mentoring top ranks. Must possess excellent blackboard and visual concept delivery skills.' },
    { title: 'Chemistry Lecturer (NEET Specialist)', type: 'Full-Time | Pune Campus', desc: 'Expert in Organic and Physical Chemistry equations. Responsible for crafting high-quality MCQ worksheets and syllabus reports.' },
    { title: 'Academic Counselor & Admin Executive', type: 'Full-Time', desc: 'Handle parents inquiries, walk-ins, offline payment logs, and manage admission document collections. Must have excellent communication skills.' },
  ];

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-16 px-6 max-w-5xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold font-sans">Build Your Career With Us</h1>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
          Join Pune's fastest growing preparatory institute. We offer highly competitive pay packages, research opportunities, and a values-driven academic workspace.
        </p>
      </div>

      {/* Grid of jobs */}
      <div className="space-y-6">
        {jobs.map((job, idx) => (
          <div
            key={idx}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6.5 shadow-premium flex flex-col md:flex-row justify-between md:items-center gap-6"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded">
                {job.type}
              </span>
              <h2 className="text-lg font-bold">{job.title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">{job.desc}</p>
            </div>
            <a
              href="mailto:careers@nobleclasses.com"
              className="text-xs font-bold px-5 py-3 bg-slate-900 dark:bg-teal-600 text-white rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap text-center flex items-center justify-center gap-2"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>

      {/* Info card */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4">
        <h3 className="text-xl font-bold font-sans">General Applications</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Don't see a matching opening? Send your CV/Resume along with a 5-minute teaching demo link directly to our recruitment team.
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm font-bold text-teal-600 dark:text-teal-400">
          <Mail className="w-4 h-4" />
          <span>careers@nobleclasses.com</span>
        </div>
      </div>

    </div>
  );
};

export default Career;
