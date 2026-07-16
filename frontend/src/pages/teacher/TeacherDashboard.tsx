import React, { useState, useRef } from 'react';
import api from '../../services/api';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, Download, FileText } from 'lucide-react';
import logger from '../../utils/logger';

export const TeacherDashboard: React.FC = () => {
  const [batchId, setBatchId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // PDF Upload State
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfDescription, setPdfDescription] = useState('');
  const [pdfCourseId, setPdfCourseId] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfUploadResult, setPdfUploadResult] = useState<any>(null);
  const [pdfUploadError, setPdfUploadError] = useState<string | null>(null);
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
  const pdfFileRef = useRef<HTMLInputElement>(null);

  // MCQ Test Creation State
  const [examForm, setExamForm] = useState({
    title: '', description: '', durationMinutes: '45', totalMarks: '20',
    negativeMarking: '1', batchId: '', scheduledAt: '', expiresAt: '',
  });
  const [questions, setQuestions] = useState([
    { questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', positiveMarks: '4', negativeMarks: '1' },
  ]);
  const [examSubmitting, setExamSubmitting] = useState(false);
  const [examSuccess, setExamSuccess] = useState(false);

  const handleDownloadTemplate = async () => {
    try {
      const res = await api.get('/attendance/template', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'attendance_template.xlsx';
      link.click();
    } catch (err) {
      logger.error('Template download failed', err);
    }
  };

  const handleUpload = async () => {
    if (!file || !batchId) { setUploadError('Please select a file and enter a Batch ID.'); return; }
    setUploading(true);
    setUploadError(null);
    setUploadResult(null);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('batchId', batchId);
      const res = await api.post('/attendance/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUploadResult(res.data);
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err: any) {
      logger.error('Attendance upload failed', err);
      setUploadError(err.response?.data?.message || 'Upload failed. Please check the file format.');
    } finally {
      setUploading(false);
    }
  };

  // Fetch courses for PDF upload dropdown
  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/admin/courses');
        setCourses(res.data.data || []);
      } catch (err) {
        logger.error('Failed to load courses', err);
      }
    };
    fetchCourses();
  }, []);

  const handlePdfUpload = async () => {
    if (!pdfFile || !pdfCourseId || !pdfTitle) {
      setPdfUploadError('Please fill all fields and select a PDF file.');
      return;
    }
    setPdfUploading(true);
    setPdfUploadError(null);
    setPdfUploadResult(null);
    try {
      const data = new FormData();
      data.append('file', pdfFile);
      data.append('title', pdfTitle);
      data.append('description', pdfDescription);
      data.append('courseId', pdfCourseId);
      const res = await api.post('/study-materials/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setPdfUploadResult(res.data);
      setPdfTitle('');
      setPdfDescription('');
      setPdfCourseId('');
      setPdfFile(null);
      if (pdfFileRef.current) pdfFileRef.current.value = '';
    } catch (err: any) {
      logger.error('PDF upload failed', err);
      setPdfUploadError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setPdfUploading(false);
    }
  };

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Teacher Portal</h1>
        <p className="text-sm text-white/60 mt-1">Upload attendance sheets, create MCQ tests, and manage your batch.</p>
      </div>

      {/* Attendance Upload Section */}
      <div className="bg-surface-1 border border-white/8 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-brand-rose-light" /> Attendance Register (Excel Upload)
          </h2>
          <button onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-rose hover:underline">
            <Download className="w-4 h-4" /> Download Template
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Batch ID</label>
            <input type="text" value={batchId} onChange={e => setBatchId(e.target.value)}
              placeholder="e.g. batch_uuid_here"
              className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-brand-rose outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Excel File (.xlsx)</label>
            <label className={`flex items-center gap-3 w-full border-2 border-dashed rounded-xl px-4 py-3 cursor-pointer transition-colors ${
              file ? 'border-brand-rose bg-brand-rose/5' : 'border-white/8 hover:border-brand-rose-light'
            }`}>
              <Upload className="w-4 h-4 text-brand-rose-light shrink-0" />
              <span className="text-sm text-slate-500 truncate">{file ? file.name : 'Click to select .xlsx file'}</span>
              <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" />
            </label>
          </div>
        </div>

        {uploadError && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-4 py-3 rounded-xl font-semibold">{uploadError}</div>}

        {uploadResult && (
          <div className={`border rounded-xl p-4 space-y-2 ${
            uploadResult.errors?.length > 0 ? 'bg-amber-500/5 border-amber-500/20' : 'bg-green-500/5 border-green-500/20'
          }`}>
            <div className="flex items-center gap-2">
              {uploadResult.errors?.length > 0 ? <AlertTriangle className="w-5 h-5 text-amber-500" /> : <CheckCircle2 className="w-5 h-5 text-green-500" />}
              <p className="text-sm font-bold text-white">{uploadResult.message}</p>
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs text-center">
              <div className="bg-surface-2 rounded-lg p-2"><p className="font-bold text-lg">{uploadResult.summary?.totalParsed}</p><p className="text-white/60">Parsed</p></div>
              <div className="bg-surface-2 rounded-lg p-2"><p className="font-bold text-lg text-emerald-400">{uploadResult.summary?.inserted}</p><p className="text-white/60">Inserted</p></div>
              <div className="bg-surface-2 rounded-lg p-2"><p className="font-bold text-lg text-amber-400">{uploadResult.summary?.skippedDuplicates}</p><p className="text-white/60">Duplicates</p></div>
              <div className="bg-surface-2 rounded-lg p-2"><p className="font-bold text-lg text-brand-rose-light">{uploadResult.summary?.failed}</p><p className="text-white/60">Failed</p></div>
            </div>
            {uploadResult.errors?.length > 0 && (
              <div className="mt-3 space-y-1 max-h-32 overflow-y-auto">
                {uploadResult.errors.map((e: string, i: number) => (
                  <p key={i} className="text-xs text-amber-400">• {e}</p>
                ))}
              </div>
            )}
          </div>
        )}

        <button onClick={handleUpload} disabled={uploading || !file || !batchId}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-rose to-brand-orange hover:from-brand-rose-dark hover:to-brand-orange-dark disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors">
          {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Processing...' : 'Upload & Process Attendance'}
        </button>
      </div>

      {/* PDF Study Material Upload Section */}
      <div className="bg-surface-1 border border-white/8 rounded-2xl p-6 space-y-5">
        <h2 className="font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-rose-light" /> Upload Study Material (PDF)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Title</label>
            <input type="text" value={pdfTitle} onChange={e => setPdfTitle(e.target.value)} placeholder="e.g. Physics Chapter 12 Notes"
              className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-brand-rose outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Course</label>
              <select value={pdfCourseId} onChange={e => setPdfCourseId(e.target.value)} className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-brand-rose outline-none">
              <option value="">Select Course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Description (optional)</label>
            <input type="text" value={pdfDescription} onChange={e => setPdfDescription(e.target.value)} placeholder="Brief description of the material"
              className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-brand-rose outline-none" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">PDF File</label>
              <label className={`flex items-center gap-3 w-full border-2 border-dashed rounded-xl px-4 py-3 cursor-pointer transition-colors ${pdfFile ? 'border-brand-rose bg-brand-rose/5' : 'border-white/8 hover:border-brand-rose-light'}`}>
              <Upload className="w-4 h-4 text-brand-rose-light shrink-0" />
              <span className="text-sm text-slate-500 truncate">{pdfFile ? pdfFile.name : 'Click to select PDF file'}</span>
              <input ref={pdfFileRef} type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files?.[0] || null)} className="hidden" />
            </label>
          </div>
        </div>

        {pdfUploadError && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-4 py-3 rounded-xl font-semibold">{pdfUploadError}</div>}

        {pdfUploadResult && (
          <div className="border border-green-500/20 bg-green-500/5 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <p className="text-sm font-bold text-white">{pdfUploadResult.message || 'PDF uploaded successfully!'}</p>
            </div>
          </div>
        )}

        <button onClick={handlePdfUpload} disabled={pdfUploading || !pdfFile || !pdfCourseId || !pdfTitle}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-rose to-brand-orange hover:from-brand-rose-dark hover:to-brand-orange-dark disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors">
          {pdfUploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
          {pdfUploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </div>

      {/* MCQ Test Creator */}
      <div className="bg-surface-1 border border-white/8 rounded-2xl p-6 space-y-5">
        <h2 className="font-bold text-white">Construct MCQ Online Test</h2>

        {examSuccess ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-brand-rose-light mx-auto" />
            <p className="font-bold text-brand-rose">Exam created and published successfully!</p>
            <button onClick={() => { setExamSuccess(false); setExamForm({ title: '', description: '', durationMinutes: '45', totalMarks: '20', negativeMarking: '1', batchId: '', scheduledAt: '', expiresAt: '' }); setQuestions([{ questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', positiveMarks: '4', negativeMarks: '1' }]); }}
              className="text-xs font-bold text-brand-rose hover:underline">Create another exam</button>
          </div>
        ) : (
          <>
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
                  <label className="text-[10px] font-bold text-slate-400 uppercase">{field.label}</label>
                  <input
                    type={field.name.includes('At') ? 'datetime-local' : 'text'}
                    value={examForm[field.name]}
                    onChange={e => setExamForm(prev => ({ ...prev, [field.name]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-brand-rose outline-none" />
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
              <textarea value={examForm.description} onChange={e => setExamForm(prev => ({ ...prev, description: e.target.value }))} rows={2}
                className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-brand-rose outline-none resize-none" />
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white/70">Questions ({questions.length})</h3>
              {questions.map((q, qi) => (
                <div key={qi} className="border border-white/8 rounded-xl p-4 space-y-3 bg-surface-2">
                  <p className="text-xs font-bold text-white/50">Question {qi + 1}</p>
                  <input type="text" placeholder="Question text..." value={q.questionText}
                    onChange={e => setQuestions(prev => prev.map((p, i) => i === qi ? { ...p, questionText: e.target.value } : p))}
                    className="w-full bg-surface-2 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-rose" />
                  <div className="grid grid-cols-2 gap-2">
                    {(['A', 'B', 'C', 'D'] as const).map(opt => (
                      <input key={opt} type="text" placeholder={`Option ${opt}`}
                        value={q[`option${opt}` as keyof typeof q] as string}
                        onChange={e => setQuestions(prev => prev.map((p, i) => i === qi ? { ...p, [`option${opt}`]: e.target.value } : p))}
                        className="bg-surface-2 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-rose" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-[10px] font-bold text-white/60 uppercase">Correct Answer</label>
                    {(['A', 'B', 'C', 'D'] as const).map(opt => (
                      <button key={opt} type="button"
                        onClick={() => setQuestions(prev => prev.map((p, i) => i === qi ? { ...p, correctAnswer: opt } : p))}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${q.correctAnswer === opt ? 'bg-brand-rose text-white' : 'bg-white/5 text-white/50'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={addQuestion} className="text-xs font-bold text-brand-rose hover:underline">+ Add Another Question</button>
            </div>

            <button onClick={handleExamSubmit} disabled={examSubmitting || !examForm.title || !examForm.batchId}
              className="w-full py-3 bg-gradient-to-r from-brand-rose to-brand-orange hover:from-brand-rose-dark hover:to-brand-orange-dark disabled:opacity-50 text-white font-semibold rounded-xl transition-colors">
              {examSubmitting ? 'Publishing...' : 'Publish MCQ Exam'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
