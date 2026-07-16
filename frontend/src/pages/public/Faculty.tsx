import React from 'react';
import { Award, GraduationCap, Briefcase } from 'lucide-react';

export const Faculty: React.FC = () => {
  const teachers = [
    {
      name: 'Dr. Ramesh Kumar',
      role: 'Head of Physics Department',
      specialization: 'Quantum Mechanics & Applied Math',
      qualifications: 'Ph.D. in Physics, IIT Bombay',
      experience: '12+ Years training JEE Advanced toppers',
      bio: 'Dr. Ramesh Kumar has coached over 500+ students secure seats under AIR 1000 in competitive examinations. His vector visualization techniques are widely recognized.',
      initials: 'RK',
    },
    {
      name: 'Dr. Sunita Deshmukh',
      role: 'Professor in Chemistry',
      specialization: 'Organic Synthesis & Physical Reactions',
      qualifications: 'Ph.D. from IISc Bangalore',
      experience: '10+ Years experience',
      bio: 'Dr. Sunita simplifies carbon structural chains and thermodynamic calculations using real-life industrial case models. Author of three board level textbook guides.',
      initials: 'SD',
    },
    {
      name: 'Prof. Amit Joshi',
      role: 'Head of Mathematics',
      specialization: 'Coordinate Geometry & Calculus',
      qualifications: 'M.Tech from IIT Kharagpur',
      experience: '8+ Years training board and JEE math',
      bio: 'Prof. Amit is famous for math shortcuts and modular algebra proofs, transforming abstract concepts into highly logical and structural visuals.',
      initials: 'AJ',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-16 px-6 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold font-sans">Meet Our Premium Faculty</h1>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base">
          Our mentors are accomplished PhD graduates and ex-IIT faculty committed to delivering logical, conceptual clarity rather than mechanical rote memorization.
        </p>
      </div>

      {/* Grid of faculty profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teachers.map((teacher, idx) => (
          <div
            key={idx}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-premium flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Profile Avatar Initials */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
                  {teacher.initials}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold">{teacher.name}</h2>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">{teacher.role}</p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                "{teacher.bio}"
              </p>
            </div>

            {/* Info details */}
            <div className="border-t border-slate-200 dark:border-slate-800/80 pt-5 mt-6 space-y-3.5">
              <div className="flex items-center text-xs text-slate-600 dark:text-slate-300">
                <GraduationCap className="w-4 h-4 mr-2.5 text-teal-500 shrink-0" />
                <span>{teacher.qualifications}</span>
              </div>
              <div className="flex items-center text-xs text-slate-600 dark:text-slate-300">
                <Award className="w-4 h-4 mr-2.5 text-teal-500 shrink-0" />
                <span>Specialized in {teacher.specialization}</span>
              </div>
              <div className="flex items-center text-xs text-slate-600 dark:text-slate-300">
                <Briefcase className="w-4 h-4 mr-2.5 text-teal-500 shrink-0" />
                <span>{teacher.experience}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Faculty;
