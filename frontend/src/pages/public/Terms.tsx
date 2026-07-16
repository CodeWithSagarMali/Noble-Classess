import React from 'react';
import { FileText } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-16 px-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-850/50 pb-4">
        <FileText className="w-8 h-8 text-teal-600 dark:text-teal-400" />
        <h1 className="text-3xl font-extrabold font-sans">Terms & Conditions</h1>
      </div>

      <p className="text-xs text-slate-400 font-semibold">Last Updated: July 13, 2026</p>

      <div className="space-y-6 text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">1. Provisional Enrollment</h2>
        <p>
          Submitting the online admission form grants a provisional status. Enrollment is finalized only upon verification of marksheets/identity cards and payment of admission fees.
        </p>

        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">2. Fee Payments & Installments</h2>
        <p>
          Students must adhere to installment due dates. Unpaid dues may result in suspension from online dashboards, classroom lectures, and support ticketing helpdesks.
        </p>

        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">3. Assessment Decorum</h2>
        <p>
          MCQ test modules feature timers. Any attempt to refresh, navigate away, or open external tabs during a running exam will lead to auto-evaluation and submission.
        </p>
      </div>
    </div>
  );
};

export default Terms;
