import React from 'react';
import { 
  Menu, 
  Search, 
  UserPlus, 
  Bell, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  Sparkles,
  School,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStudents } from '../context/StudentContext';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, isAdmin, logout, openLoginModal } = useAuth();
  const { stats, filters, setFilters, setIsAddModalOpen } = useStudents();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 no-print transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left side: Hamburger + Brand for mobile + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar navigation"
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm lg:hidden">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-600 bg-clip-text text-transparent">
                  HADI HADI
                </h1>
                <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Student Percentage Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Academic Performance, Percentage Calculator & Records System
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Search student by name or Roll ID (e.g. HH-2026)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl transition-all focus:outline-hidden focus:ring-3 focus:ring-indigo-100 font-medium placeholder:text-slate-400"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold p-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right side: Quick KPI Pill & Admin Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Metrics Badge */}
          <div className="hidden xl:flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Avg:</span>
              <span className="font-bold text-slate-900">{stats.averagePercentage}%</span>
            </div>
            <div className="w-px h-3 bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <span>Top:</span>
              <span className="font-bold text-emerald-600">{stats.highestPercentage}%</span>
            </div>
          </div>

          {/* Add Student quick button */}
          <button
            onClick={() => {
              if (!isAdmin) {
                openLoginModal();
              } else {
                setIsAddModalOpen(true);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Student</span>
          </button>

          {/* Admin Profile / Login Pill */}
          {isAdmin ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="relative group cursor-pointer">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                  alt={user?.name || 'Admin'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                  {user?.name?.split(' ')[0]}
                  <ShieldCheck className="w-3 h-3 text-indigo-600" />
                </p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Admin</p>
              </div>
              <button
                onClick={logout}
                title="Logout Admin"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-indigo-600" />
              <span>Admin Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search input */}
      <div className="mt-2.5 md:hidden">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search student or ID..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-500"
          />
        </div>
      </div>
    </header>
  );
};
