import React from 'react';
import { Target, Award, Star, MessageSquare } from 'lucide-react';

export const Toppers: React.FC = () => {
  const toppers = [
    {
      name: 'Aditya Sen',
      rank: 'JEE Advanced AIR 142',
      score: 'Score: 310 / 360',
      strategy: 'Focus heavily on Physics mechanics visual structures and inorganic chemical chains. Do at least 20 multi-concept calculations daily.',
      initials: 'AS',
    },
    {
      name: 'Priya Patel',
      rank: 'NEET AIR 235',
      score: 'Score: 685 / 720',
      strategy: 'Solve NCERT line by line. Play online MCQ series matching actual NTA timers to minimize silly calculation slips under time pressure.',
      initials: 'PP',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-16 px-6 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold font-sans">Student Toppers Spotlight</h1>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
          Learn about the prep frameworks, routines, and strategies utilized by our toppers to clear competitive entrances.
        </p>
      </div>

      {/* List of interviews */}
      <div className="space-y-10">
        {toppers.map((topper, idx) => (
          <div
            key={idx}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-8 shadow-premium grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* Left avatar card */}
            <div className="flex flex-col items-center justify-center text-center space-y-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800/80 pb-6 lg:pb-0 lg:pr-8 shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg">
                {topper.initials}
              </div>
              <div>
                <h2 className="text-lg font-bold">{topper.name}</h2>
                <span className="bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded-full block mt-1 uppercase tracking-wider">
                  {topper.rank}
                </span>
                <p className="text-xs text-slate-400 font-semibold mt-1">{topper.score}</p>
              </div>
            </div>

            {/* Right strategy detail */}
            <div className="lg:col-span-3 space-y-4 flex flex-col justify-center">
              <h3 className="flex items-center text-sm font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                <MessageSquare className="w-4 h-4 mr-2" /> Prep Methodology & Advice
              </h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "{topper.strategy}"
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Toppers;
