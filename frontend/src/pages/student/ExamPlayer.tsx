import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Clock, AlertTriangle, CheckCircle2, Trophy } from 'lucide-react';
import logger from '../../utils/logger';

interface Question {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  positiveMarks: number;
  negativeMarks: number;
}

interface ExamInfo {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  negativeMarking: number;
}

type AnswerMap = Record<string, 'A' | 'B' | 'C' | 'D' | ''>;

export const ExamPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<ExamInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await api.get(`/exams/${id}/questions`);
        setExam(res.data.exam);
        setQuestions(res.data.questions);
        setTimeLeft(res.data.exam.durationMinutes * 60);
      } catch (err: any) {
        logger.error('Failed to load exam', err);
        navigate('/student/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0 || result) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timeLeft, result]);

  // Auto-submit when timer expires
  useEffect(() => {
    if (timeLeft === 0 && !result && !submitting) {
      handleSubmit(true);
    }
  }, [timeLeft, result, submitting]);

  const handleAnswer = (qId: string, option: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev => ({ ...prev, [qId]: prev[qId] === option ? '' : option }));
  };

  const handleSubmit = async (auto = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!auto && Object.keys(answers).length === 0) {
      // Allow submission even with no answers (auto-submit on timer expiry)
    }
    setSubmitting(true);
    try {
      const res = await api.post(`/exams/${id}/submit`, { answers });
      setResult(res.data.result);
    } catch (err: any) {
      logger.error('Exam submission failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-brand-rose border-t-transparent rounded-full animate-spin" /></div>;

  if (result) {
    const maxMarks = exam?.totalMarks || (result.totalQuestions * (questions[0]?.positiveMarks ?? 4));
    const percentage = maxMarks > 0 ? Math.round((result.marksObtained / maxMarks) * 100) : 0;
    return (
      <div className="max-w-lg mx-auto space-y-6 text-center py-10">
        <Trophy className="w-16 h-16 text-amber-400 mx-auto" />
        <h1 className="text-3xl font-extrabold text-white">Exam Submitted!</h1>
        <div className="bg-surface-1 border border-white/8 rounded-2xl p-8 space-y-4">
          <p className="text-5xl font-extrabold text-brand-rose">{result.marksObtained}</p>
          <p className="text-white/50 text-sm font-semibold">Marks Obtained</p>
          <div className="grid grid-cols-3 gap-4 text-center border-t border-white/8 pt-4">
            <div><p className="text-lg font-bold text-green-500">{result.correctAnswers}</p><p className="text-xs text-white/50">Correct</p></div>
            <div><p className="text-lg font-bold text-brand-rose">{result.wrongAnswers}</p><p className="text-xs text-white/50">Wrong</p></div>
            <div><p className="text-lg font-bold text-white/50">{result.totalQuestions - result.attemptedQuestions}</p><p className="text-xs text-white/50">Skipped</p></div>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2.5 mt-2">
            <div className="bg-brand-rose h-2.5 rounded-full transition-all" style={{ width: `${percentage}%` }} />
          </div>
          <p className="text-xs text-white/50">{percentage}% Score</p>
        </div>
        <button onClick={() => navigate('/student/dashboard')}
          className="px-8 py-3 bg-gradient-to-r from-brand-rose to-brand-orange text-white font-semibold rounded-xl hover:from-brand-rose-dark hover:to-brand-orange-dark transition-colors">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Exam Header Bar */}
      <div className="bg-surface-1 border border-white/8 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-white text-sm">{exam?.title}</h1>
          <p className="text-xs text-white/50">Question {currentQ + 1} of {questions.length}</p>
        </div>
        <div className={`flex items-center gap-2 font-bold text-lg px-4 py-2 rounded-xl ${
          timeLeft < 300 ? 'bg-brand-rose/10 text-brand-rose animate-pulse' : 'bg-brand-rose/10 text-brand-rose'
        }`}>
          <Clock className="w-5 h-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question Navigator */}
      <div className="flex flex-wrap gap-2">
        {questions.map((_, idx) => (
          <button key={idx} onClick={() => setCurrentQ(idx)}
            className={`w-8 h-8 text-xs font-bold rounded-lg transition-colors ${
              idx === currentQ ? 'bg-brand-rose text-white' :
              answers[questions[idx].id] ? 'bg-brand-rose/20 text-brand-rose' :
              'bg-white/5 text-white/50'
            }`}>
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Question Card */}
      {q && (
        <div className="bg-surface-1 border border-white/8 rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-white/50 font-semibold">
              <span className="bg-brand-rose/10 text-brand-rose px-2 py-0.5 rounded">+{q.positiveMarks} / -{q.negativeMarks}</span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">{q.questionText}</p>
          </div>
          <div className="space-y-3">
            {(['A', 'B', 'C', 'D'] as const).map((opt) => {
              const text = q[`option${opt}` as keyof Question] as string;
              const isSelected = answers[q.id] === opt;
              return (
                <button key={opt} onClick={() => handleAnswer(q.id, opt)}
                  className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${
                    isSelected ? 'border-brand-rose bg-brand-rose/5' : 'border-white/8 hover:border-brand-rose-light'
                  }`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isSelected ? 'bg-brand-rose text-white' : 'bg-white/5 text-white/50'
                  }`}>{opt}</span>
                  <span className="text-sm text-white/90 pt-0.5">{text}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0}
          className="px-5 py-2.5 border border-white/8 rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-white/5 transition-colors">
          ← Previous
        </button>
        {currentQ < questions.length - 1 ? (
          <button onClick={() => setCurrentQ(q => q + 1)}
            className="px-5 py-2.5 bg-surface-3 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
            Next →
          </button>
        ) : (
          <button onClick={() => handleSubmit()} disabled={submitting}
            className="px-6 py-2.5 bg-gradient-to-r from-brand-rose to-brand-orange text-white rounded-xl text-sm font-bold hover:from-brand-rose-dark hover:to-brand-orange-dark disabled:opacity-50 transition-colors">
            {submitting ? 'Submitting...' : '✓ Submit Exam'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamPlayer;
