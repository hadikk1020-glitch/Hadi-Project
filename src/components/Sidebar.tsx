import React from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  GraduationCap, 
  BarChart3, 
  FileText, 
  Settings, 
  LogOut, 
  Sparkles,
  ShieldCheck,
  ChevronRight,
  School
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStudents } from '../context/StudentContext';

export type NavTab = 'dashboard' | 'students' | 'performance' | 'reports' | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen
}) => {
  const { user, isAdmin, logout, openLoginModal } = useAuth();
  const { setIsAddModalOpen, students } = useStudents();

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const handleAddStudentClick = () => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    setIsAddModalOpen(true);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'from-blue-500 to-indigo-600',
      badge: `${students.length} Total`
    },
    {
      id: 'students' as NavTab,
      label: 'Students',
      icon: GraduationCap,
      color: 'from-emerald-500 to-teal-600',
      badge: null
    },
    {
      id: 'performance' as NavTab,
      label: 'Performance',
      icon: BarChart3,
      color: 'from-violet-500 to-purple-600',
      badge: 'Live'
    },
    {
      id: 'reports' as NavTab,
      label: 'Reports',
      icon: FileText,
      color: 'from-amber-500 to-orange-600',
      badge: 'Print'
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings',
      icon: Settings,
      color: 'from-slate-600 to-slate-800',
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 no-print ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 text-white">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  HADI HADI
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                  Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[155px]">
                Student Percentage Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Quick Add Student Action Button */}
        <div className="p-4 pb-2">
          <button
            onClick={handleAddStudentClick}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <UserPlus className="w-3.5 h-3.5" />
            </div>
            <span>+ Add Student</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Main Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-900 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-xs`
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-indigo-200/80 text-indigo-900'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-indigo-600" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Admin Status Card & Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 m-2 rounded-2xl">
          {isAdmin ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-1">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                  alt={user?.name || 'Admin'}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {user?.name || 'Admin'}
                    </p>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">Admin Active</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-rose-100"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout Admin</span>
              </button>
            </div>
          ) : (
            <div className="text-center p-2">
              <div className="flex justify-center mb-1.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs font-bold text-slate-800">Admin Login Required</p>
              <p className="text-[11px] text-slate-500 mb-2">
                Sign in to add, edit or delete student records.
              </p>
              <button
                onClick={openLoginModal}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Admin Sign In
              </button>
            </div>
          )}
        </div>

        {/* Footer brand signature */}
        <div className="px-5 py-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="font-semibold text-slate-500">HADI HADI System</span>
          <span>v2.6</span>
        </div>
      </aside>
    </>
  );
};
