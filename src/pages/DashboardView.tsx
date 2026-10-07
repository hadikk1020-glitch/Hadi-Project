import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Award, 
  Percent, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  UserPlus, 
  ArrowUpRight, 
  GraduationCap, 
  BookOpen, 
  Flame,
  ChevronRight,
  School
} from 'lucide-react';
import { useStudents } from '../context/StudentContext';
import { useAuth } from '../context/AuthContext';
import { CircularProgress } from '../components/CircularProgress';
import { StudentCard } from '../components/StudentCard';
import { Student } from '../types/student';
import { getStatusTheme } from '../utils/calculations';

interface DashboardViewProps {
  onNavigateTab: (tab: 'students' | 'performance' | 'reports') => void;
  onViewStudent: (student: Student) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onViewStudent
}) => {
  const { stats, rankedStudents, setIsAddModalOpen, setStudentToEdit, setStudentToDelete } = useStudents();
  const { isAdmin, openLoginModal } = useAuth();

  const topThree = rankedStudents.slice(0, 3);
  const recentStudents = rankedStudents.slice(0, 6);

  // Grade buckets for distribution chart
  const gradeBuckets = [
    { label: 'Distinction (≥90%)', count: rankedStudents.filter((s) => s.percentage >= 90).length, color: 'bg-emerald-500', textColor: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'First Class (80-89%)', count: rankedStudents.filter((s) => s.percentage >= 80 && s.percentage < 90).length, color: 'bg-violet-500', textColor: 'text-violet-700', bg: 'bg-violet-50' },
    { label: 'Second Class (70-79%)', count: rankedStudents.filter((s) => s.percentage >= 70 && s.percentage < 80).length, color: 'bg-sky-500', textColor: 'text-sky-700', bg: 'bg-sky-50' },
    { label: 'Passed (50-69%)', count: rankedStudents.filter((s) => s.percentage >= 50 && s.percentage < 70).length, color: 'bg-amber-500', textColor: 'text-amber-700', bg: 'bg-amber-50' },
    { label: 'Below 50% (Remedial)', count: rankedStudents.filter((s) => s.percentage < 50).length, color: 'bg-rose-500', textColor: 'text-rose-700', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent opacity-60 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-pink-200 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              <span>Official Percentage & Academic Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Welcome to <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-white bg-clip-text text-transparent">HADI HADI</span>
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 font-medium leading-relaxed">
              Real-time student marks evaluation, automated percentage calculation out of 100, official report cards, and performance analytics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                if (!isAdmin) openLoginModal();
                else setIsAddModalOpen(true);
              }}
              className="flex-1 md:flex-initial py-3 px-5 rounded-2xl bg-white text-indigo-900 hover:bg-slate-100 font-extrabold text-xs sm:text-sm shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <UserPlus className="w-4 h-4 text-indigo-600" />
              <span>+ Add New Student</span>
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="flex-1 md:flex-initial py-3 px-5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Merit Reports</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Required Dashboard Statistics Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            Academic Overview Statistics
          </h2>
          <span className="text-xs text-slate-400 font-semibold">
            Auto-calculated live from student scores
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* 1. Total Students */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Students
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {stats.totalStudents}
            </p>
            <p className="text-[11px] font-semibold text-blue-600 mt-1 flex items-center gap-1">
              <span>Enrolled across grades</span>
            </p>
          </div>

          {/* 2. Average Percentage */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Average %
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tight">
              {stats.averagePercentage}%
            </p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">
              Class aggregate
            </p>
          </div>

          {/* 3. Highest Percentage */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Highest %
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">
              {stats.highestPercentage}%
            </p>
            <p className="text-[11px] font-bold text-slate-700 mt-1 truncate">
              {stats.topStudent ? stats.topStudent.name : 'No records'}
            </p>
          </div>

          {/* 4. Lowest Percentage */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Lowest %
              </span>
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 rotate-180" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-700 tracking-tight">
              {stats.lowestPercentage}%
            </p>
            <p className="text-[11px] font-semibold text-slate-400 mt-1">
              Minimum scored
            </p>
          </div>

          {/* 5. Students Above 90% */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Above 90%
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
              {stats.aboveNinetyCount}
            </p>
            <p className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Distinction Club</span>
            </p>
          </div>

          {/* 6. Students Below 50% */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                Below 50%
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-rose-700 tracking-tight">
              {stats.belowFiftyCount}
            </p>
            <p className="text-[11px] font-bold text-rose-600 mt-1">
              Needs Improvement
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 High Achievers Podium & Grade Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top 3 Achievers Podium Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  HADI HADI Merit Podium
                </h3>
                <p className="text-xs text-slate-400">Top 3 Performing Students</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Full Ranks →
            </button>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {topThree.map((student, idx) => {
              const rankThemes = [
                { badge: 'bg-amber-400 text-amber-950', ring: 'ring-amber-400', label: '1st Gold' },
                { badge: 'bg-slate-300 text-slate-800', ring: 'ring-slate-300', label: '2nd Silver' },
                { badge: 'bg-amber-700 text-amber-100', ring: 'ring-amber-700', label: '3rd Bronze' }
              ];
              const rTheme = rankThemes[idx] || rankThemes[2];

              return (
                <div
                  key={student.id}
                  onClick={() => onViewStudent(student)}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className={`w-12 h-12 rounded-xl object-cover ring-2 ${rTheme.ring}`}
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${rTheme.badge}`}
                      >
                        {idx + 1}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {student.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {student.studentId} • {student.class} ({student.section})
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-indigo-700">
                      {student.percentage}%
                    </span>
                    <span className="block text-[10px] font-bold text-emerald-600">
                      {student.marksObtained}/{student.totalMarks} Marks
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grade Distribution & Pass Rate Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Performance Bands & Grade Distribution
              </h3>
              <p className="text-xs text-slate-400">
                Breakdown of students across percentage tiers
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500">Overall Pass Rate:</span>
              <span className="ml-1 text-sm font-black text-emerald-600">
                {stats.passingRate}%
              </span>
            </div>
          </div>

          <div className="space-y-3.5 my-auto">
            {gradeBuckets.map((bucket, i) => {
              const bucketPct = stats.totalStudents > 0 ? Math.round((bucket.count / stats.totalStudents) * 100) : 0;

              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${bucket.color}`} />
                      {bucket.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{bucket.count} Students</span>
                      <span className="font-bold text-slate-900 w-10 text-right">{bucketPct}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${bucket.color} rounded-full transition-all duration-700`}
                      style={{ width: `${bucketPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-indigo-900">
              Need comprehensive class-by-class charts?
            </span>
            <button
              onClick={() => onNavigateTab('performance')}
              className="font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Analytics</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Student Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              Student Percentage Cards
            </h2>
            <p className="text-xs text-slate-400">
              Showing student percentage meters and performance standing
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('students')}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            <span>View All ({rankedStudents.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {recentStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onView={onViewStudent}
              onEdit={(s) => setStudentToEdit(s)}
              onDelete={(s) => setStudentToDelete(s)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
