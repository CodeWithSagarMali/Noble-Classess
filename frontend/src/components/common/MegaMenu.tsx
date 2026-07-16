import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Award, Calendar, CheckSquare, Sparkles } from 'lucide-react';

interface MegaMenuProps {
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ onClose }) => {
  return (
    <div 
      className="absolute left-0 w-full top-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 mega-menu-shadow transition-all duration-300 z-50 py-8 px-12"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
        
        {/* Col 1: Entrance Prep */}
        <div>
          <h3 className="flex items-center text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-4">
            <BookOpen className="w-4 h-4 mr-2" /> Academic Entrance Prep
          </h3>
          <ul className="space-y-3">
            <li>
              <Link to="/courses" onClick={onClose} className="group block">
                <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-500">
                  IIT-JEE Ultimate Prep
                </span>
                <span className="block text-xs text-slate-400">Class 11 & 12 | 2-Year Rigorous Prep</span>
              </Link>
            </li>
            <li>
              <Link to="/courses" onClick={onClose} className="group block">
                <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-500">
                  NEET Excellence Course
                </span>
                <span className="block text-xs text-slate-400">Class 11 & 12 | Medical entrance focused</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 2: Foundation & Boards */}
        <div>
          <h3 className="flex items-center text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-4">
            <GraduationCap className="w-4 h-4 mr-2" /> Foundation & Boards
          </h3>
          <ul className="space-y-3">
            <li>
              <Link to="/courses" onClick={onClose} className="group block">
                <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-500">
                  Class 10th Boards Foundation
                </span>
                <span className="block text-xs text-slate-400">1-Year Board prep + NTSE preparation</span>
              </Link>
            </li>
            <li>
              <Link to="/courses" onClick={onClose} className="group block">
                <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-500">
                  NTSE & Junior Olympiads
                </span>
                <span className="block text-xs text-slate-400">Class 8, 9 & 10 conceptual math and science</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Success Stories & Faculty */}
        <div>
          <h3 className="flex items-center text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-4">
            <Award className="w-4 h-4 mr-2" /> Success & Faculty
          </h3>
          <ul className="space-y-3">
            <li>
              <Link to="/achievements" onClick={onClose} className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-500">
                <Sparkles className="w-4 h-4 mr-2 text-teal-500" /> Historic Ranks & Ranks count
              </Link>
            </li>
            <li>
              <Link to="/toppers" onClick={onClose} className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-500">
                <CheckSquare className="w-4 h-4 mr-2 text-teal-500" /> Topper Students Interviews
              </Link>
            </li>
            <li>
              <Link to="/faculty" onClick={onClose} className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-500">
                <Calendar className="w-4 h-4 mr-2 text-teal-500" /> Professional Mentors & PhDs
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Featured Success Card */}
        <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <span className="bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-bold uppercase px-2 py-1 rounded">
              Featured Achievement
            </span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-3">
              JEE Advanced 2025 Ranks
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Rahul K. secures AIR 12 and 18 students secure ranks under AIR 500. Admissions open for repeaters.
            </p>
          </div>
          <Link
            to="/admission"
            onClick={onClose}
            className="block text-center text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 py-2 rounded-lg mt-4 transition-colors"
          >
            Apply Online Now
          </Link>
        </div>

      </div>
    </div>
  );
};

export default MegaMenu;
