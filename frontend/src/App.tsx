import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Courses from './pages/public/Courses';
import Faculty from './pages/public/Faculty';
import Gallery from './pages/public/Gallery';
import Achievements from './pages/public/Achievements';
import Toppers from './pages/public/Toppers';
import Testimonials from './pages/public/Testimonials';
import FAQ from './pages/public/FAQ';
import Blog from './pages/public/Blog';
import BlogDetail from './pages/public/BlogDetail';
import Contact from './pages/public/Contact';
import Career from './pages/public/Career';
import Privacy from './pages/public/Privacy';
import Terms from './pages/public/Terms';
import Refund from './pages/public/Refund';
import Admission from './pages/public/Admission';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

// Dashboard Pages (lazy loaded)
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const ExamPlayer = lazy(() => import('./pages/student/ExamPlayer'));
const StudentFees = lazy(() => import('./pages/student/Fees'));
const StudentNotes = lazy(() => import('./pages/student/Notes'));
const StudentTickets = lazy(() => import('./pages/student/Tickets'));
const StudentExams = lazy(() => import('./pages/student/Exams'));
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'));
const TeacherAttendancePage = lazy(() => import('./pages/teacher/AttendancePage'));
const TeacherNotesPage = lazy(() => import('./pages/teacher/NotesPage'));
const TeacherCreateTestPage = lazy(() => import('./pages/teacher/CreateTestPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminBatches = lazy(() => import('./pages/admin/Batches'));
const AdminCourses = lazy(() => import('./pages/admin/Courses'));
const AdminTeachers = lazy(() => import('./pages/admin/Teachers'));
const AdminFees = lazy(() => import('./pages/admin/Fees'));
const AdminGallery = lazy(() => import('./pages/admin/Gallery'));

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Guard
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('ADMIN' | 'TEACHER' | 'STUDENT')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
    if (user.role === 'TEACHER') return <Navigate to="/teacher/dashboard" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Suspense fallback
const DashboardSuspense = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  }>
    {children}
  </Suspense>
);

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/toppers" element={<Toppers />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/career" element={<Career />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/admission" element={<Admission />} />

        {/* Auth Routes */}
        <Route path="/auth/login" element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'TEACHER' ? '/teacher/dashboard' : '/student/dashboard'} replace /> : <Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />
      </Route>

      {/* Student Dashboard Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardSuspense><StudentDashboard /></DashboardSuspense>} />
        <Route path="fees" element={<DashboardSuspense><StudentFees /></DashboardSuspense>} />
        <Route path="exams" element={<DashboardSuspense><StudentExams /></DashboardSuspense>} />
        <Route path="exams/:id" element={<DashboardSuspense><ExamPlayer /></DashboardSuspense>} />
        <Route path="notes" element={<DashboardSuspense><StudentNotes /></DashboardSuspense>} />
        <Route path="tickets" element={<DashboardSuspense><StudentTickets /></DashboardSuspense>} />
      </Route>

      {/* Teacher Dashboard Routes */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardSuspense><TeacherDashboard /></DashboardSuspense>} />
        <Route path="attendance" element={<DashboardSuspense><TeacherAttendancePage /></DashboardSuspense>} />
        <Route path="notes" element={<DashboardSuspense><TeacherNotesPage /></DashboardSuspense>} />
        <Route path="create-test" element={<DashboardSuspense><TeacherCreateTestPage /></DashboardSuspense>} />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardSuspense><AdminDashboard /></DashboardSuspense>} />
        <Route path="admissions" element={<DashboardSuspense><AdminDashboard /></DashboardSuspense>} />
        <Route path="batches" element={<DashboardSuspense><AdminBatches /></DashboardSuspense>} />
        <Route path="courses" element={<DashboardSuspense><AdminCourses /></DashboardSuspense>} />
        <Route path="teachers" element={<DashboardSuspense><AdminTeachers /></DashboardSuspense>} />
        <Route path="fees" element={<DashboardSuspense><AdminFees /></DashboardSuspense>} />
        <Route path="gallery" element={<DashboardSuspense><AdminGallery /></DashboardSuspense>} />
        <Route path="enquiries" element={<DashboardSuspense><AdminDashboard /></DashboardSuspense>} />
        <Route path="logs" element={<DashboardSuspense><AdminDashboard /></DashboardSuspense>} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-950 text-slate-800 dark:text-white">
          <h1 className="text-7xl font-black text-teal-600 dark:text-teal-400">404</h1>
          <p className="text-lg font-semibold">Page Not Found</p>
          <a href="/" className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors">Go Home</a>
        </div>
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
