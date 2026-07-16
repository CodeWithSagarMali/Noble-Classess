import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-16 px-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-850/50 pb-4">
        <ShieldCheck className="w-8 h-8 text-teal-600 dark:text-teal-400" />
        <h1 className="text-3xl font-extrabold font-sans">Privacy Policy</h1>
      </div>

      <p className="text-xs text-slate-400 font-semibold">Last Updated: July 13, 2026</p>

      <div className="space-y-6 text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">1. Information We Collect</h2>
        <p>
          We collect personal data necessary to manage online admissions. This includes names, parent contacts, residential addresses, and uploaded PDF documents (Aadhaar cards, academic marksheets, and passport photographs).
        </p>

        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">2. How We Use Information</h2>
        <p>
          Data is used to verify eligibility, assign rolls and academic batches, issue fees invoices, register MCQ test results, and trigger SMS/Email announcements notifications.
        </p>

        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">3. Storage & Encryption Security</h2>
        <p>
          All documents are uploaded directly to secure storage. Session authentication tokens are signed using high-security JWT algorithms with cookie-based transmissions.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
