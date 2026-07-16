import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { BookOpen, Clock, ClipboardList } from 'lucide-react';
import logger from '../../utils/logger';

interface ExamRecord {
  id: string;
  title: string;
  durationMinutes: number;
  scheduledAt: string;
  results: { marksObtained: number; totalQuestions: number; correctAnswers: number }[];
}

export const StudentExams: React.FC = () => {
  const [exams, setExams] = useState<ExamRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get('/exams/list');
        setExams(res.data.data || []);
      } catch (err) {
        logger.error('Failed to load exams', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-brand-rose border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Online MCQ Exams</h1>
      <div className="space-y-3">
        {exams.length === 0 && <p className="text-xs text-white/50 text-center py-8">No exams scheduled for your batch yet.</p>}
        {exams.map(exam => {
          const result = exam.results?.[0];
          const isAttempted = !!result;
          return (
            <div key={exam.id} className="bg-surface-1 border border-white/8 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">{exam.title}</p>
                <p className="text-xs text-white/50 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {exam.durationMinutes} mins</p>
              </div>
              <div className="flex items-center gap-3">
                {isAttempted ? (
                  <div className="text-right">
                    <p className="text-xs text-white/50">Your Score</p>
                    <p className="text-sm font-extrabold text-brand-rose">{result.marksObtained} / {result.totalQuestions * 4}</p>
                  </div>
                ) : (
                  <Link to={`/student/exams/${exam.id}`} className="px-4 py-2 bg-gradient-to-r from-brand-rose to-brand-orange text-white text-xs font-bold rounded-xl hover:from-brand-rose-dark hover:to-brand-orange-dark transition-colors">
                    Start Exam
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentExams;
