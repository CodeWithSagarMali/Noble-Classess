import React from 'react';

export const TeacherNotesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Upload PDF Notes</h1>
      <div className="bg-surface-1 border border-white/8 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-brand-rose-light/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📝</span>
        </div>
        <h2 className="text-lg font-bold text-white/80 mb-2">PDF Notes Upload</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">Upload study materials, notes, and assignments for your students here. Feature coming soon.</p>
      </div>
    </div>
  );
};

export default TeacherNotesPage;
