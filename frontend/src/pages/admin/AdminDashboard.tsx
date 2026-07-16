import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { Users, BookOpen, CreditCard, AlertCircle, TrendingUp, FileText, UserPlus, Calendar } from 'lucide-react';
import logger from '../../utils/logger';

interface DashboardStats {
  cards: {
    totalStudents: number; totalTeachers: number; totalCourses: number;
    totalBatches: number; pendingAdmissions: number;
    revenueCollected: number; revenueOutstanding: number;
  };
  charts: {
    courseDistribution: { name: string; batchesCount: number }[];
    revenueOverview: { name: string; value: number }[];
  };
  recentStudents: any[];
  recentTickets: any[];
}

const COLORS = ['#14b8a6', '#6366f1', '#f59e0b', '#f43f5e', '#8b5cf6'];

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'admissions' | 'enquiries' | 'logs'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, admissionsRes, enquiriesRes, logsRes] = await Promise.allSettled([
          api.get('/admin/stats'),
          api.get('/admissions/applications'),
          api.get('/cms/enquiries'),
          api.get('/admin/logs'),
        ]);
        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data.data);
        if (admissionsRes.status === 'fulfilled') setAdmissions(admissionsRes.value.data.data || []);
        if (enquiriesRes.status === 'fulfilled') setEnquiries(enquiriesRes.value.data.data || []);
        if (logsRes.status === 'fulfilled') setLogs(logsRes.value.data.data || []);
      } catch (err) {
        logger.error('Admin dashboard fetch failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAdmissionDecision = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const batchId = status === 'APPROVED' ? prompt('Enter Batch ID to assign:') : undefined;
    if (status === 'APPROVED' && !batchId) return;
    try {
      await api.patch(`/admissions/applications/${id}/status`, { status, batchId });
      setAdmissions(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update admission status.');
    }
  };

  const handleBackup = async () => {
    const res = await api.get('/admin/backup', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a'); a.href = url; a.download = 'noble_classes_backup.json'; a.click();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>;

  const cardDefs = [
    { label: 'Enrolled Students', value: stats?.cards.totalStudents ?? 0, icon: Users, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { label: 'Faculty Members', value: stats?.cards.totalTeachers ?? 0, icon: UserPlus, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Active Batches', value: stats?.cards.totalBatches ?? 0, icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Pending Admissions', value: stats?.cards.pendingAdmissions ?? 0, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Revenue Collected', value: `₹${(stats?.cards.revenueCollected ?? 0).toLocaleString('en-IN')}`, icon: CreditCard, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Outstanding Fees', value: `₹${(stats?.cards.revenueOutstanding ?? 0).toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  const TABS = ['overview', 'admissions', 'enquiries', 'logs'] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Admin Control Panel</h1>
          <p className="text-sm text-slate-400 mt-1">Comprehensive system overview and management</p>
        </div>
        <button onClick={handleBackup}
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <FileText className="w-4 h-4 text-teal-500" /> Export Backup
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cardDefs.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase leading-tight">{card.label}</span>
                <div className={`p-2 rounded-xl ${card.bg}`}><Icon className={`w-4 h-4 ${card.color}`} /></div>
              </div>
              <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-bold capitalize rounded-t-xl transition-colors ${
              activeTab === tab ? 'bg-white dark:bg-slate-900 border border-b-0 border-slate-200 dark:border-slate-800 text-teal-600 dark:text-teal-400' : 'text-slate-400 hover:text-slate-600'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Revenue Breakdown</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={stats?.charts.revenueOverview} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {stats?.charts.revenueOverview.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Batches per Course</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats?.charts.courseDistribution} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="batchesCount" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Students */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 lg:col-span-2">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Recent Registrations</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-slate-100 dark:border-slate-800">
                  {['Name', 'Admission No', 'Status', 'Registered On'].map(h => (
                    <th key={h} className="text-left py-2 pr-4 font-bold text-slate-400 uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {(stats?.recentStudents ?? []).map(s => (
                    <tr key={s.id} className="border-b border-slate-50 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 pr-4 font-semibold text-slate-700 dark:text-slate-300">{s.firstName} {s.lastName}</td>
                      <td className="py-2.5 pr-4 text-slate-400">{s.admissionNo || '—'}</td>
                      <td className="py-2.5 pr-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.status === 'APPROVED' ? 'bg-green-500/10 text-green-600' : s.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600' : 'bg-rose-500/10 text-rose-500'}`}>{s.status}</span></td>
                      <td className="py-2.5 text-slate-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Admissions Tab */}
      {activeTab === 'admissions' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-slate-800 dark:text-slate-100">All Applications</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-slate-100 dark:border-slate-800">
                {['Name', 'Admission No', 'Batch', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left py-2 pr-4 font-bold text-slate-400 uppercase">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {admissions.map(a => (
                  <tr key={a.id} className="border-b border-slate-50 dark:border-slate-900">
                    <td className="py-3 pr-4 font-semibold text-slate-700 dark:text-slate-300">{a.firstName} {a.lastName}</td>
                    <td className="py-3 pr-4 text-slate-400">{a.admissionNo || '—'}</td>
                    <td className="py-3 pr-4 text-slate-400">{a.batch?.name || 'Unassigned'}</td>
                    <td className="py-3 pr-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${a.status === 'APPROVED' ? 'bg-green-500/10 text-green-600' : a.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600' : 'bg-rose-500/10 text-rose-500'}`}>{a.status}</span></td>
                    <td className="py-3 flex gap-2">
                      {a.status === 'PENDING' && (
                        <>
                          <button onClick={() => handleAdmissionDecision(a.id, 'APPROVED')} className="px-3 py-1 bg-green-500/10 text-green-600 rounded-lg text-[10px] font-bold hover:bg-green-500/20">Approve</button>
                          <button onClick={() => handleAdmissionDecision(a.id, 'REJECTED')} className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-lg text-[10px] font-bold hover:bg-rose-500/20">Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {admissions.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-slate-400">No applications found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enquiries Tab */}
      {activeTab === 'enquiries' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-slate-800 dark:text-slate-100">Contact Enquiries</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {enquiries.length === 0 ? <p className="text-xs text-slate-400 text-center py-6">No enquiries received yet.</p> :
              enquiries.map(e => (
                <div key={e.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{e.name} <span className="text-slate-400 font-normal">· {e.email} · {e.phone}</span></p>
                      <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">{e.subject}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${e.status === 'RESOLVED' ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'}`}>{e.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{e.message}</p>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-slate-800 dark:text-slate-100">System Audit Logs</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-xs">
            {logs.length === 0 ? <p className="text-center text-slate-400 py-6">No audit records found.</p> :
              logs.map(log => (
                <div key={log.id} className="flex gap-3 py-2 border-b border-slate-100 dark:border-slate-900">
                  <span className="text-slate-400 shrink-0">{new Date(log.createdAt).toLocaleString()}</span>
                  <span className="bg-teal-500/10 text-teal-600 dark:text-teal-400 px-1.5 rounded shrink-0">{log.action}</span>
                  <span className="text-slate-600 dark:text-slate-400 truncate">{log.details}</span>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
