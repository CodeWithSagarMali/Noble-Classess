import React from 'react';

export const StudentNotes: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Study Material</h1>
      <div className="bg-surface-1 border border-white/8 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-brand-rose/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📚</span>
        </div>
        <h2 className="text-lg font-bold text-white/90 mb-2">No study materials uploaded yet</h2>
        <p className="text-xs text-white/50 max-w-md mx-auto">Your teachers will upload PDF notes, assignments, and reference materials here. Please check back later.</p>
      </div>
    </div>
  );
};

export default StudentNotes;
