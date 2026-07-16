import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen, CreditCard, CheckSquare, Clock, HelpCircle, Download, AlertCircle, Star, FileText } from 'lucide-react';
import logger from '../../utils/logger';

interface AttendanceRecord { status: string; date: string; }
interface PaymentRecord { id: string; amount: number; status: string; type: string; dueDate: string; paidAt?: string; invoiceUrl?: string; }
interface ExamRecord { id: string; title: string; durationMinutes: number; scheduledAt: string; results: { marksObtained: number; totalQuestions: number; correctAnswers: number }[]; }
interface StudyMaterial { id: string; title: string; description: string; fileUrl: string; course: { name: string }; createdAt: string; }

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<{ analytics: any; records: AttendanceRecord[] } | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [exams, setExams] = useState<ExamRecord[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  const profile = user?.profile;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attRes, payRes, examRes, matRes] = await Promise.allSettled([
          api.get('/attendance/report'),
          api.get('/fees/list'),
          api.get('/exams/list'),
          api.get('/study-materials/list'),
        ]);
        if (attRes.status === 'fulfilled') setAttendance(attRes.value.data);
        if (payRes.status === 'fulfilled') setPayments(payRes.value.data.data || []);
        if (examRes.status === 'fulfilled') setExams(examRes.value.data.data || []);
        if (matRes.status === 'fulfilled') setMaterials(matRes.value.data.data || []);
      } catch (err) {
        logger.error('Failed to load student dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const attendanceData = [
    { name: 'Present', value: attendance?.analytics?.presentCount ?? 0, color: '#14b8a6' },
    { name: 'Absent', value: attendance?.analytics?.absentCount ?? 0, color: '#f43f5e' },
    { name: 'Late', value: attendance?.analytics?.lateCount ?? 0, color: '#f59e0b' },
  ];

  const statCards = [
    { label: 'Attendance %', value: `${attendance?.analytics?.attendancePercentage ?? '--'}%`, icon: CheckSquare, color: 'text-teal-500' },
    { label: 'Total Classes', value: attendance?.analytics?.totalDays ?? '--', icon: Clock, color: 'text-indigo-500' },
    { label: 'Pending Fees', value: payments.filter(p => p.status === 'PENDING').length, icon: CreditCard, color: 'text-rose-500' },
    { label: 'Exams Available', value: exams.length, icon: BookOpen, color: 'text-amber-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-indigo-700 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold">Welcome back, {profile?.firstName || user?.email.split('@')[0]}! 👋</h1>
          <p className="text-teal-100 text-sm">Roll No: <strong>{profile?.rollNumber || 'Pending Assignment'}</strong> &nbsp;|&nbsp; Admission: <strong>{profile?.admissionNo || 'N/A'}</strong></p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
          profile?.status === 'APPROVED' ? 'bg-green-400/20 text-green-100' : 'bg-amber-400/20 text-amber-100'
        }`}>
          Status: {profile?.status ?? 'PENDING'}
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">{card.label}</span>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-slate-800 dark:text-slate-100">Attendance Overview</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={attendanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fee Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-slate-800 dark:text-slate-100">Fee Payments</h2>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {payments.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No fee records found.</p>
            ) : payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{p.type} Fee</p>
                  <p className="text-xs text-slate-400">Due: {new Date(p.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">₹{p.amount.toLocaleString('en-IN')}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    p.status === 'PAID' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-rose-500/10 text-rose-500'
                  }`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exams Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-slate-800 dark:text-slate-100">Available MCQ Exams</h2>
        {exams.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No exams scheduled for your batch yet.</p>
        ) : (
          <div className="space-y-3">
            {exams.map((exam) => {
              const result = exam.results?.[0];
              const isAttempted = !!result;
              return (
                <div key={exam.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{exam.title}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {exam.durationMinutes} mins
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {isAttempted ? (
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Your Score</p>
                        <p className="text-sm font-extrabold text-teal-600 dark:text-teal-400">{result.marksObtained} / {result.totalQuestions * 4}</p>
                      </div>
                    ) : (
                      <Link to={`/student/exams/${exam.id}`}
                        className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition-colors">
                        Start Exam
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Study Materials Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-500" /> Study Materials
        </h2>
        {materials.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No study materials uploaded yet for your course.</p>
        ) : (
          <div className="space-y-3">
            {materials.map((material) => (
              <div key={material.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{material.title}</p>
                  <p className="text-xs text-slate-400">{material.course?.name} • {new Date(material.createdAt).toLocaleDateString()}</p>
                  {material.description && <p className="text-xs text-slate-500 dark:text-slate-400">{material.description}</p>}
                </div>
                <a href={material.fileUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
