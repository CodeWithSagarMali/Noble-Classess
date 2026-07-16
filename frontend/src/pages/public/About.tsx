import React from 'react';
import { Target, Award, ShieldCheck, HeartHandshake } from 'lucide-react';

export const About: React.FC = () => {
  const values = [
    { title: 'Student First Approach', desc: 'Every lecture schedule, worksheet design, and practice test iteration is planned keeping student learning speed and stress levels in mind.', icon: HeartHandshake },
    { title: 'Rigorous Concept Validation', desc: 'No formulas are taught without first deriving their foundations, enabling students to tackle unexpected questions with basic mechanics.', icon: Target },
    { title: 'Empowering Scholarship System', desc: 'Scholarship waivers up to 100% on class coaching fees for economically weaker segments, making quality JEE/NEET prep accessible.', icon: Award },
    { title: 'Sincere Safety & Ethics', desc: 'Rigorous digital logging, clean environment, parents notification triggers, and zero marketing exaggeration policies.', icon: ShieldCheck },
  ];

  return (
    <div className="dark:bg-[#0F0F1A] bg-[#0F0F1A] text-white py-16 px-6 max-w-7xl mx-auto space-y-16">
      
      {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl font-extrabold font-sans text-white">About Noble Classes</h1>
          <p className="text-white/50 leading-relaxed text-sm md:text-base">
          Founded in 2012, Noble Classes is Maharashtra's premier engineering and medical preparatory institute, dedicated to mentoring aspirants for IIT-JEE, NEET, and Olympiads.
        </p>
      </div>

      {/* Grid of Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {values.map((val, idx) => {
          const Icon = val.icon;
          return (
            <div key={idx} className="flex gap-4 p-6 dark:bg-[#1E1E35]/80 bg-[#1E1E35]/80 rounded-2xl border dark:border-white/8 border-white/8 shadow-premium">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">{val.title}</h2>
                <p className="text-xs text-white/50 leading-relaxed">{val.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Story */}
      <div className="bg-gradient-to-tr from-[#16162A] to-[#1E1E35] text-white rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-8 border border-white/8">
        <div className="lg:col-span-2 space-y-4">
          <span className="bg-violet-500/20 text-violet-300 text-[10px] font-bold px-2 py-1 rounded">OUR JOURNEY</span>
          <h2 className="text-2xl font-bold font-sans text-white">Our Historic Foundation</h2>
          <p className="text-sm text-white/60 leading-relaxed">
            What started as a single batch of 15 students in Pune has grown into a structured hub of conceptual science. We believe that competitive exams do not measure intelligence, but rather focus, consistency, and conceptual precision.
          </p>
          <p className="text-sm text-white/60 leading-relaxed">
            Today, our multi-tenant SaaS coaching portal provides automated dashboards, allowing teachers to mark Excel registers, students to play exam timers, and parents to check invoice histories in one click.
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 text-center flex flex-col justify-center">
          <p className="text-5xl font-extrabold text-orange-400">12+</p>
          <p className="text-xs uppercase tracking-wider text-white/40 font-semibold">Years of Academic Excellence</p>
        </div>
      </div>

    </div>
  );
};

export default About;
