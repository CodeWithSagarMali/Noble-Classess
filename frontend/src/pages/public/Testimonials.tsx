import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Star, MessageSquare } from 'lucide-react';

interface TestimonialData {
  id: string;
  studentName: string;
  courseName: string;
  text: string;
  rating: number;
  batchYear: string;
  studentImage?: string;
}

export const Testimonials: React.FC = () => {
  const [reviews, setReviews] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackReviews: TestimonialData[] = [
    {
      id: '1',
      studentName: 'Aditya Sen',
      courseName: 'IIT-JEE prep',
      text: 'The guidance here is top-notch. Dr. Ramesh Kumar explains complex physics concepts in a visual and intuitive way. Highly recommended!',
      rating: 5,
      batchYear: 'JEE AIR 142 (2025)',
    },
    {
      id: '2',
      studentName: 'Priya Patel',
      courseName: 'NEET Prep',
      text: 'Mock test series and individual student analysis maps helped me trace my weak areas and score 680+ in NEET.',
      rating: 5,
      batchYear: 'NEET AIR 235 (2025)',
    },
  ];

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get('/cms/testimonials');
        if (res.data?.status === 'success') {
          setReviews(res.data.data);
        }
      } catch (err) {
        console.warn('Testimonial API offline, using static templates', err);
        setReviews(fallbackReviews);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-16 px-6 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold font-sans">Reviews & Testimonials</h1>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
          Hear direct feedback from students and parents regarding their academic growth and coaching experiences.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6.5 shadow-premium flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 text-amber-400 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              {/* Author profile */}
              <div className="border-t border-slate-200 dark:border-slate-800/80 pt-5 mt-6 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  {rev.studentName[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold">{rev.studentName}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{rev.batchYear} | {rev.courseName}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Testimonials;
