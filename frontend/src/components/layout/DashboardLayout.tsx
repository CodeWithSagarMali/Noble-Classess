import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  FileSpreadsheet,
  FileText,
  CreditCard,
  PlusSquare,
  ClipboardList,
  BookOpen,
  HelpCircle,
  FileClock,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Image,
  MessageSquare,
  Download
} from 'lucide-react';

interface SidebarLink {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
}

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getLinks = (): SidebarLink[] => {
    if (!user) return [];

    if (user.role === 'ADMIN') {
      return [
        { label: 'Home', path: '/', icon: LayoutDashboard },
        { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Admissions', path: '/admin/admissions', icon: PlusSquare },
        { label: 'Manage Batches', path: '/admin/batches', icon: Calendar },
        { label: 'Manage Courses', path: '/admin/courses', icon: BookOpen },
        { label: 'Manage Teachers', path: '/admin/teachers', icon: Users },
        { label: 'Offline Fee Receipts', path: '/admin/fees', icon: CreditCard },
        { label: 'Inquiries Lead Box', path: '/admin/enquiries', icon: MessageSquare },
        { label: 'Gallery CMS', path: '/admin/gallery', icon: Image },
        { label: 'System Audit Logs', path: '/admin/logs', icon: FileClock },
      ];
    }

    if (user.role === 'TEACHER') {
      return [
        { label: 'Home', path: '/', icon: LayoutDashboard },
        { label: 'Overview', path: '/teacher/dashboard', icon: LayoutDashboard },
        { label: 'Class Register (Excel)', path: '/teacher/attendance', icon: FileSpreadsheet },
        { label: 'Upload PDF Notes', path: '/teacher/notes', icon: FileText },
        { label: 'Construct MCQ Test', path: '/teacher/create-test', icon: PlusSquare },
      ];
    }

    // STUDENT
    return [
      { label: 'Home', path: '/', icon: LayoutDashboard },
      { label: 'Dashboard Profile', path: '/student/dashboard', icon: LayoutDashboard },
      { label: 'Fee Payments', path: '/student/fees', icon: CreditCard },
      { label: 'Online MCQ Exam', path: '/student/exams', icon: ClipboardList },
      { label: 'Study Material (PDFs)', path: '/student/notes', icon: Download },
      { label: 'Support Helpdesk', path: '/student/tickets', icon: HelpCircle },
    ];
  };

  const links = getLinks();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0">
        
        {/* Sidebar Header Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 space-x-2">
          <GraduationCap className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          <span className="font-sans font-extrabold tracking-tight text-sm text-slate-800 dark:text-white">
            NOBLE PORTAL
          </span>
        </div>

        {/* User Context card */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/50">
          <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/40">
            <p className="text-xs text-slate-400 font-medium">Logged in as</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/15'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-500'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Log out */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Body */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Dashboard Topbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 transition-colors">
          
          {/* Mobile menu trigger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Quick Header Greeting */}
          <h1 className="hidden sm:block text-sm font-semibold text-slate-800 dark:text-slate-100">
            Welcome back, {user?.role.toLowerCase()}
          </h1>

          {/* Topbar Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* User Profile display */}
            <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-800 pl-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                {user?.email[0].toUpperCase()}
              </div>
              <span className="hidden md:block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {user?.email.split('@')[0]}
              </span>
            </div>

          </div>
        </header>

        {/* Dashboard Body Content Panel */}
        <main className="flex-grow p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            <span className="font-sans font-extrabold tracking-tight text-sm text-slate-800 dark:text-white">
              NOBLE PORTAL
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/15'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              setSidebarOpen(false);
              handleLogout();
            }}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout Session
          </button>
        </div>
      </aside>

    </div>
  );
};

export default DashboardLayout;
