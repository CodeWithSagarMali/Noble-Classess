import React, { useState } from 'react';
import api from '../../services/api';
import { PlusSquare, CheckCircle2, AlertTriangle } from 'lucide-react';
import logger from '../../utils/logger';

interface Question {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  positiveMarks: string;
  negativeMarks: string;
}

export const TeacherCreateTestPage: React.FC = () => {
  const [examForm, setExamForm] = useState({
    title: '', description: '', durationMinutes: '45', totalMarks: '20',
    negativeMarking: '1', batchId: '', scheduledAt: '', expiresAt: '',
  });
  const [questions, setQuestions] = useState<Question[]>([
    { questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', positiveMarks: '4', negativeMarks: '1' },
  ]);
  const [examSubmitting, setExamSubmitting] = useState(false);
  const [examSuccess, setExamSuccess] = useState(false);

  const addQuestion = () => {
    setQuestions(prev => [...prev, { questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', positiveMarks: '4', negativeMarks: '1' }]);
  };

  const handleExamSubmit = async () => {
    setExamSubmitting(true);
    try {
      await api.post('/exams/create', { ...examForm, questions });
      setExamSuccess(true);
    } catch (err: any) {
      logger.error('Exam creation failed', err);
      alert(err.response?.data?.message || 'Failed to create exam.');
    } finally {
      setExamSubmitting(false);
    }
  };

  if (examSuccess) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-extrabold text-white">Construct MCQ Online Test</h1>
        <div className="bg-surface-1 border border-white/8 rounded-2xl p-12 text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-brand-rose-light mx-auto" />
          <p className="font-bold text-brand-rose text-lg">Exam created and published successfully!</p>
          <button onClick={() => { setExamSuccess(false); setExamForm({ title: '', description: '', durationMinutes: '45', totalMarks: '20', negativeMarking: '1', batchId: '', scheduledAt: '', expiresAt: '' }); setQuestions([{ questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', positiveMarks: '4', negativeMarks: '1' }]); }} className="text-xs font-bold text-brand-rose hover:underline">Create another exam</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Construct MCQ Online Test</h1>
      <div className="bg-surface-1 border border-white/8 rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([
            { name: 'title', label: 'Exam Title', placeholder: 'Physics Mock Test #1' },
            { name: 'batchId', label: 'Batch ID', placeholder: 'Batch UUID' },
            { name: 'durationMinutes', label: 'Duration (mins)', placeholder: '45' },
            { name: 'totalMarks', label: 'Total Marks', placeholder: '20' },
            { name: 'negativeMarking', label: 'Negative Marks per Wrong', placeholder: '1' },
            { name: 'scheduledAt', label: 'Scheduled At', placeholder: '' },
            { name: 'expiresAt', label: 'Expires At', placeholder: '' },
          ] as const).map(field => (
            <div key={field.name} className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/60 uppercase">{field.label}</label>
              <input type={field.name.includes('At') ? 'datetime-local' : 'text'} value={examForm[field.name]} onChange={e => setExamForm(prev => ({ ...prev, [field.name]: e.target.value }))} placeholder={field.placeholder} className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-brand-rose outline-none" />
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-white/60 uppercase">Description</label>
          <textarea value={examForm.description} onChange={e => setExamForm(prev => ({ ...prev, description: e.target.value }))} rows={2} className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-brand-rose outline-none resize-none" />
        </div>
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-white/70">Questions ({questions.length})</h3>
          {questions.map((q, qi) => (
            <div key={qi} className="border border-white/8 rounded-xl p-4 space-y-3 bg-surface-2">
              <p className="text-xs font-bold text-white/50">Question {qi + 1}</p>
              <input type="text" placeholder="Question text..." value={q.questionText} onChange={e => setQuestions(prev => prev.map((p, i) => i === qi ? { ...p, questionText: e.target.value } : p))} className="w-full bg-surface-2 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-rose" />
              <div className="grid grid-cols-2 gap-2">
                {(['A', 'B', 'C', 'D'] as const).map(opt => (
                  <input key={opt} type="text" placeholder={`Option ${opt}`} value={q[`option${opt}` as keyof Question]} onChange={e => setQuestions(prev => prev.map((p, i) => i === qi ? { ...p, [`option${opt}`]: e.target.value } : p))} className="bg-surface-2 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-rose" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <label className="text-[10px] font-bold text-white/60 uppercase">Correct Answer</label>
                {(['A', 'B', 'C', 'D'] as const).map(opt => (
                  <button key={opt} type="button" onClick={() => setQuestions(prev => prev.map((p, i) => i === qi ? { ...p, correctAnswer: opt } : p))} className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${q.correctAnswer === opt ? 'bg-brand-rose text-white' : 'bg-white/5 text-white/50'}`}>{opt}</button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={addQuestion} className="text-xs font-bold text-brand-rose hover:underline">+ Add Another Question</button>
        </div>
        <button onClick={handleExamSubmit} disabled={examSubmitting || !examForm.title || !examForm.batchId} className="w-full py-3 bg-gradient-to-r from-brand-rose to-brand-orange hover:from-brand-rose-dark hover:to-brand-orange-dark disabled:opacity-50 text-white font-semibold rounded-xl transition-colors">
          {examSubmitting ? 'Publishing...' : 'Publish MCQ Exam'}
        </button>
      </div>
    </div>
  );
};

export default TeacherCreateTestPage;
