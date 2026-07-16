import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FaqItem[] = [
    {
      q: 'How does the online admission form submission work?',
      a: 'Students register an account on the Portal, complete the profile details, upload their Aadhaar, passport photograph, and school board marksheets, and process the provisional admission fee. Admins review files and allocate batches accordingly.',
    },
    {
      q: 'Are coaching fees payable in split installments?',
      a: 'Yes, coaching tuition fees can be split into multiple installments. The system logs payment history, outstanding balances, and issues automated printable PDF invoices for both online and manual transactions.',
    },
    {
      q: 'What is the MCQ Test Series scoring pattern?',
      a: 'Tests feature customized Positive and Negative Marking rules. Timer trackers enforce submission limits. Results are automatically compiled upon time expiration, generating scores and rank leaderboard placements.',
    },
    {
      q: 'How is attendance captured and updated?',
      a: 'Teachers download the standard template sheet, mark PRESENT/ABSENT/LATE flags against student roll numbers, and upload the updated spreadsheet back to the portal. Processing is instantaneous.',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-16 px-6 max-w-4xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold font-sans">Frequently Asked Questions</h1>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
          Everything you need to know about admissions, portals access, fee installment, and online assessments.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4 pt-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-800 dark:text-slate-100"
              >
                <span className="flex items-center"><HelpCircle className="w-4 h-4 mr-2.5 text-teal-500 shrink-0" /> {faq.q}</span>
                {isOpen ? <ChevronUp className="w-4.5 h-4.5 text-teal-500 shrink-0" /> : <ChevronDown className="w-4.5 h-4.5 text-teal-500 shrink-0" />}
              </button>
              
              {isOpen && (
                <div className="p-5 pt-0 border-t border-slate-200 dark:border-slate-850/50 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default FAQ;
