import React from 'react';

export const TeacherNotesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Upload PDF Notes</h1>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📝</span>
        </div>
        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">PDF Notes Upload</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">Upload study materials, notes, and assignments for your students here. Feature coming soon.</p>
      </div>
    </div>
  );
};

export default TeacherNotesPage;
