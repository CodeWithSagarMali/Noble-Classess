import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Calendar, User, ArrowLeft, BookOpen } from 'lucide-react';

interface BlogPostDetail {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  createdAt: string;
  author?: { email: string };
}

export const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fallbackPost: BlogPostDetail = {
    title: 'How to Crack JEE Advanced Physics in 6 Months',
    excerpt: 'Struggling with advanced mechanics problems? Here are the 5 core conceptual methodologies recommended by expert faculty and top rankers.',
    content: `
      <p>JEE Advanced requires a deep visual understanding of mechanics and electromagnetism. Instead of memorizing formulas, students must practice deriving equations from fundamental axioms. Work out at least 20 multi-concept problems daily and analyze errors.</p>
      <h3>1. Establish Strong Axiomatic Foundations</h3>
      <p>Physics is built on fundamental assumptions like Newton's Laws or Conservation principles. When studying a concept, ensure you understand the boundaries of these equations (e.g. friction limits, relativistic constraints).</p>
      <h3>2. Emphasize Visualization & Diagrams</h3>
      <p>Always start by drawing a clean free-body diagram (FBD). Label all active force elements, gravitational forces, tension strings, and friction coefficients. A clean sketch solves 50% of coordinate system ambiguities.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    category: 'JEE Preparation',
    createdAt: new Date().toISOString(),
    author: { email: 'admin@nobleclasses.com' },
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/cms/blogs/${slug}`);
        if (res.data?.status === 'success') {
          setPost(res.data.data);
        }
      } catch (err) {
        console.warn('Post API offline, using fallback detail layout', err);
        setPost(fallbackPost);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-20 bg-white dark:bg-slate-950 min-h-screen">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-950 min-h-screen space-y-4">
        <h2 className="text-xl font-bold">Article not found.</h2>
        <Link to="/blog" className="text-teal-500 hover:underline">Back to Blog</Link>
      </div>
    );
  }

  return (
    <article className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-16 px-6 max-w-4xl mx-auto space-y-8">
      
      {/* Back button */}
      <Link
        to="/blog"
        className="text-xs font-semibold text-slate-500 hover:text-teal-500 flex items-center space-x-1.5 w-max"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Blog List</span>
      </Link>

      {/* Meta Header */}
      <div className="space-y-4">
        <span className="bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-extrabold px-3 py-1.5 rounded uppercase tracking-wider">
          {post.category}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold font-sans leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center space-x-4 text-xs text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-850/50 pb-4">
          <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5 text-teal-500" /> {new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="flex items-center"><User className="w-4 h-4 mr-1.5 text-teal-500" /> Written By {post.author?.email.split('@')[0] || 'Faculty'}</span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="h-[350px] overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Article Content Body (HTML processed) */}
      <div 
        className="prose prose-slate dark:prose-invert max-w-none text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-6 pt-4"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

    </article>
  );
};

export default BlogDetail;
