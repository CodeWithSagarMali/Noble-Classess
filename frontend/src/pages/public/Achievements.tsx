import React from 'react';
import { Award, Star, Users, Brain, ShieldAlert } from 'lucide-react';

export const Achievements: React.FC = () => {
  const records = [
    { year: '2025', exam: 'IIT-JEE Advanced', details: '18 Students under AIR 500. Highest Rank: AIR 142.' },
    { year: '2025', exam: 'NEET Medical', details: '45 Students scored 650+ marks. Highest Rank: AIR 235.' },
    { year: '2024', exam: 'Class 12th Board', details: '100% Pass rate. 38 Students scored above 95% total marks.' },
    { year: '2024', exam: 'Olympiad Gold', details: '2 students won Gold at National Physics Olympiad.' },
  ];

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-16 px-6 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold font-sans">Our Historic Achievements</h1>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
          Every year, our rigorous conceptual learning methodology yields top selections in engineering, medical, and national board assessments.
        </p>
      </div>

      {/* Grid of accomplishments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {records.map((rec, idx) => (
          <div
            key={idx}
            className="flex gap-4 p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-premium"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <span className="bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Batch Year {rec.year}
              </span>
              <h2 className="text-xl font-bold font-sans">{rec.exam}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{rec.details}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Highlight Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 text-center space-y-4 max-w-3xl mx-auto border border-slate-800 shadow-xl">
        <Star className="w-8 h-8 text-teal-400 mx-auto fill-current animate-pulse" />
        <h3 className="text-2xl font-bold">500+ Engineering & Medical Seats</h3>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Over the past decade, our students have secured placements in premier institutes including IIT Bombay, IIT Delhi, AIIMS New Delhi, and BITS Pilani.
        </p>
      </div>

    </div>
  );
};

export default Achievements;
