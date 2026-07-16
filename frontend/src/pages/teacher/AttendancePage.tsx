import React, { useState, useRef } from 'react';
import api from '../../services/api';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, Download } from 'lucide-react';
import logger from '../../utils/logger';

export const TeacherAttendancePage: React.FC = () => {
  const [batchId, setBatchId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Class Register (Excel)</h1>
      <div className="bg-surface-1 border border-white/8 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-brand-rose-light" /> Attendance Upload
          </h2>
          <button onClick={handleDownloadTemplate} className="flex items-center gap-1.5 text-xs font-bold text-brand-rose hover:underline">
            <Download className="w-4 h-4" /> Download Template
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Batch ID</label>
            <input type="text" value={batchId} onChange={e => setBatchId(e.target.value)} placeholder="e.g. batch_uuid_here" className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-brand-rose outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Excel File (.xlsx)</label>
            <label className={`flex items-center gap-3 w-full border-2 border-dashed rounded-xl px-4 py-3 cursor-pointer transition-colors ${file ? 'border-brand-rose bg-brand-rose/5' : 'border-white/8 hover:border-brand-rose-light'}`}>
              <Upload className="w-4 h-4 text-brand-rose-light shrink-0" />
              <span className="text-sm text-slate-500 truncate">{file ? file.name : 'Click to select .xlsx file'}</span>
              <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" />
            </label>
          </div>
        </div>
        {uploadError && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-4 py-3 rounded-xl font-semibold">{uploadError}</div>}
        {uploadResult && (
          <div className={`border rounded-xl p-4 space-y-2 ${uploadResult.errors?.length > 0 ? 'bg-amber-500/5 border-amber-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
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
                  {uploadResult.errors.map((e: string, i: number) => <p key={i} className="text-xs text-amber-400">• {e}</p>)}
              </div>
            )}
          </div>
        )}
        <button onClick={handleUpload} disabled={uploading || !file || !batchId} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-rose to-brand-orange hover:from-brand-rose-dark hover:to-brand-orange-dark disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors">
          {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Processing...' : 'Upload & Process Attendance'}
        </button>
      </div>
    </div>
  );
};

export default TeacherAttendancePage;
