import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import api from '../../services/api';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  createdAt: string;
  author?: { email: string };
}

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackPosts: BlogPostData[] = [
    {
      id: '1',
      title: 'How to Crack JEE Advanced Physics in 6 Months',
      slug: 'crack-jee-advanced-physics-6-months',
      excerpt: 'Struggling with advanced mechanics problems? Here are the 5 core conceptual methodologies recommended by expert faculty and top rankers.',
      coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
      category: 'JEE Preparation',
      createdAt: new Date().toISOString(),
      author: { email: 'admin@nobleclasses.com' },
    },
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/cms/blogs');
        if (res.data?.status === 'success') {
          setPosts(res.data.data);
        }
      } catch (err) {
        console.warn('Blog API offline, utilizing static templates', err);
        setPosts(fallbackPosts);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-16 px-6 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold font-sans">Institute Blog & Resources</h1>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
          Expert articles, learning guides, board strategies, and coaching logs written by seasoned educators.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden shadow-premium flex flex-col justify-between"
            >
              {/* Cover Image */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-4 left-4 bg-teal-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">
                  {post.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-semibold">
                    <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1" /> By {post.author?.email.split('@')[0] || 'Faculty'}</span>
                  </div>
                  <h2 className="text-lg font-bold leading-snug">{post.title}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <RouterLink
                  to={`/blog/${post.slug}`}
                  className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center hover:underline pt-2 w-max"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </RouterLink>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Blog;
