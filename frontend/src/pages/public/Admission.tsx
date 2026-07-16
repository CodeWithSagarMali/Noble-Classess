import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Upload, CreditCard, User, BookOpen, FileText } from 'lucide-react';
import logger from '../../utils/logger';

type Step = 'personal' | 'documents' | 'payment';

interface CourseOption {
  id: string;
  name: string;
}

interface AdmissionState {
  courseId: string;
  parentName: string;
  parentPhone: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  passportPhoto: File | null;
  aadhaar: File | null;
  marksheet: File | null;
}

const STEPS: { id: Step; label: string; icon: React.ComponentType<any> }[] = [
  { id: 'personal', label: 'Personal Details', icon: User },
  { id: 'documents', label: 'Upload Documents', icon: FileText },
  { id: 'payment', label: 'Payment', icon: CreditCard },
];

export const Admission: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [admissionResult, setAdmissionResult] = useState<{ admissionNo: string; pdfUrl: string; feeId: string; feeAmount: number } | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [courses, setCourses] = useState<CourseOption[]>([]);

  const [form, setForm] = useState<AdmissionState>({
    courseId: '',
    parentName: '',
    parentPhone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    passportPhoto: null,
    aadhaar: null,
    marksheet: null,
  });

  useEffect(() => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) setForm({ ...form, [name]: files[0] });
  };

  const handleSubmitForm = async () => {
    if (!user) { navigate('/auth/login'); return; }
    setLoading(true);
    setError(null);
    try {
      const data = new FormData();
      data.append('courseId', form.courseId);
      data.append('parentName', form.parentName);
      data.append('parentPhone', form.parentPhone);
      data.append('address', form.address);
      data.append('dateOfBirth', form.dateOfBirth);
      data.append('gender', form.gender);
      if (form.passportPhoto) data.append('passportPhoto', form.passportPhoto);
      if (form.aadhaar) data.append('aadhaar', form.aadhaar);
      if (form.marksheet) data.append('marksheet', form.marksheet);

      const res = await api.post('/admissions/submit', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data?.status === 'success') {
        setAdmissionResult({
          admissionNo: res.data.admissionNo,
          pdfUrl: res.data.pdfUrl,
          feeId: res.data.admissionFee.id,
          feeAmount: res.data.admissionFee.amount,
        });
        setCurrentStep('payment');
      }
    } catch (err: any) {
      logger.error('Admission form submission failed', err);
      setError(err.response?.data?.message || 'Failed to submit admission form. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  const handleMockPayment = async () => {
    if (!admissionResult) return;
    setLoading(true);
    setError(null);
    try {
      // Step 1: Create order
      const orderRes = await api.post('/fees/order', { paymentId: admissionResult.feeId });
      const { order } = orderRes.data;

      // Step 2: Mock verify (for dev without Razorpay keys)
      const verifyRes = await api.post('/fees/verify', {
        paymentId: admissionResult.feeId,
        razorpayOrderId: order.id,
        razorpayPaymentId: `pay_mock_${Date.now()}`,
        razorpaySignature: '',
      });

      if (verifyRes.data?.status === 'success') {
        setPaymentSuccess(true);
      }
    } catch (err: any) {
      logger.error('Mock payment failed', err);
      setError(err.response?.data?.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <BookOpen className="h-10 w-10 text-teal-600 dark:text-teal-400 mx-auto" />
          <h1 className="text-3xl font-extrabold font-sans text-slate-800 dark:text-slate-100">Online Admission Portal</h1>
          <p className="text-xs text-slate-500">Complete the 3-step process to secure your seat</p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-0">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isDone = idx < stepIndex;
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isDone ? 'bg-teal-600 text-white' : isActive ? 'bg-teal-600 text-white ring-4 ring-teal-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-[10px] font-bold hidden sm:block ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>{step.label}</span>
                </div>
                {idx < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${idx < stepIndex ? 'bg-teal-600' : 'bg-slate-200 dark:bg-slate-800'}`} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Card Content */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-premium">
          {error && <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-4 py-3 rounded-xl font-semibold">{error}</div>}

          {/* STEP 1: Personal Details */}
          {currentStep === 'personal' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Personal & Parent Information</h2>
              {!user && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs px-4 py-3 rounded-xl font-semibold">
                  ⚠️ You must <a href="/auth/login" className="underline">log in</a> before submitting an admission form.
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Course Selection</label>
                  <select name="courseId" value={form.courseId} onChange={handleChange}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none">
                    <option value="">-- Select Course --</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none">
                    <option value="">-- Select Gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Parent / Guardian Name</label>
                  <input type="text" name="parentName" value={form.parentName} onChange={handleChange} placeholder="Full name"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Parent Phone</label>
                  <input type="tel" name="parentPhone" value={form.parentPhone} onChange={handleChange} placeholder="+91XXXXXXXXXX"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Residential Address</label>
                <textarea name="address" value={form.address} onChange={handleChange} rows={3} placeholder="Full address with city, pincode..."
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none resize-none" />
              </div>
              <button onClick={() => setCurrentStep('documents')} disabled={!form.courseId || !form.gender || !form.dateOfBirth || !form.parentName || !user}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors">
                Continue to Documents →
              </button>
            </div>
          )}

          {/* STEP 2: Document Upload */}
          {currentStep === 'documents' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Upload Required Documents</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">All files must be JPEG, PNG, or PDF format. Max 5MB each.</p>

              {(['passportPhoto', 'aadhaar', 'marksheet'] as const).map((field) => {
                const labels: Record<string, string> = {
                  passportPhoto: '📷 Passport Photo (JPEG/PNG)',
                  aadhaar: '🪪 Aadhaar Card (PDF/PNG)',
                  marksheet: '📄 10th / 12th Marksheet (PDF)',
                };
                return (
                  <div key={field} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{labels[field]}</label>
                    <label className={`flex items-center gap-3 w-full border-2 border-dashed rounded-xl px-4 py-4 cursor-pointer transition-colors ${
                      form[field] ? 'border-teal-500 bg-teal-500/5' : 'border-slate-200 dark:border-slate-800 hover:border-teal-400'
                    }`}>
                      <Upload className="w-5 h-5 text-teal-500 shrink-0" />
                      <span className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {form[field] ? (form[field] as File).name : 'Click to select file'}
                      </span>
                      <input type="file" name={field} onChange={handleFile} className="hidden" accept="image/*,application/pdf" />
                    </label>
                  </div>
                );
              })}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setCurrentStep('personal')}
                  className="flex-1 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  ← Back
                </button>
                <button onClick={handleSubmitForm} disabled={loading || !form.passportPhoto || !form.aadhaar || !form.marksheet}
                  className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors">
                  {loading ? <span className="flex items-center justify-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /></span> : 'Submit Application →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {currentStep === 'payment' && (
            <div className="space-y-6">
              {paymentSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-teal-500 mx-auto" />
                  <h2 className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">Admission Confirmed!</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Application Number: <strong className="text-slate-800 dark:text-slate-200">{admissionResult?.admissionNo}</strong>
                  </p>
                  <p className="text-xs text-slate-500">Your admission is pending final approval. Login to your dashboard to track status.</p>
                  <a href="/student/dashboard"
                    className="block py-3 bg-teal-600 text-white font-semibold rounded-xl text-sm text-center">
                    Go to Student Dashboard
                  </a>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Admission Fee Payment</h2>
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Application Number</span>
                      <span className="font-bold text-teal-600 dark:text-teal-400">{admissionResult?.admissionNo}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Admission Registration Fee</span>
                      <span className="font-bold">₹ {admissionResult?.feeAmount?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between">
                      <span className="font-bold text-sm">Total Payable</span>
                      <span className="font-extrabold text-teal-600 dark:text-teal-400 text-lg">₹ {admissionResult?.feeAmount?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">
                    {import.meta.env.MODE !== 'production' ? '⚡ Dev mode: Mock payment will be processed without actual transaction.' : 'Secured by Razorpay payment gateway.'}
                  </p>
                  <button onClick={handleMockPayment} disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:opacity-90 text-white font-semibold rounded-xl disabled:opacity-50 transition-all shadow-lg">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (
                      <><CreditCard className="w-5 h-5" /><span>Pay ₹{admissionResult?.feeAmount?.toLocaleString('en-IN')} Securely</span></>
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admission;
