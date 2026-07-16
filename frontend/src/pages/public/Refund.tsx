import React from 'react';
import { CreditCard } from 'lucide-react';

export const Refund: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-16 px-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-850/50 pb-4">
        <CreditCard className="w-8 h-8 text-teal-600 dark:text-teal-400" />
        <h1 className="text-3xl font-extrabold font-sans">Refund Policy</h1>
      </div>

      <p className="text-xs text-slate-400 font-semibold">Last Updated: July 13, 2026</p>

      <div className="space-y-6 text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">1. Admission Registration Fees</h2>
        <p>
          The provisional admission registration fee of Rs. 5,000 is strictly non-refundable, as it offsets verification processing and portal account provisioning costs.
        </p>

        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">2. Coaching Tuition Fees</h2>
        <p>
          Tuition fee refunds can be requested within the first 14 calendar days of batch start. A pro-rated deduction matching standard class days taken will be deducted. No refunds are processed after 14 days.
        </p>

        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">3. Mode of Reimbursement</h2>
        <p>
          Approved refunds are processed back via the original online payment gateway mode (Razorpay) or direct bank transfer within 7 to 10 working days.
        </p>
      </div>
    </div>
  );
};

export default Refund;
