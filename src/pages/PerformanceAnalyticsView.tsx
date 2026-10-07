import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  AlertCircle, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  ChevronRight,
  Flame
} from 'lucide-react';
import { useStudents } from '../context/StudentContext';
import { Student } from '../types/student';
import { CircularProgress } from '../components/CircularProgress';
import { getStatusTheme } from '../utils/calculations';

interface PerformanceAnalyticsViewProps {
  onViewStudent: (student: Student) => void;
}

export const PerformanceAnalyticsView: React.FC<PerformanceAnalyticsViewProps> = ({
  onViewStudent
}) => {
  const { students, rankedStudents, stats, availableClasses } = useStudents();

  // Calculate subject-wise performance across the entire school
  const subjectMap = new Map<string, { totalMarks: number; obtainedMarks: number; count: number }>();
  students.forEach((s) => {
    s.subjects.forEach((sub) => {
      const entry = subjectMap.get(sub.name) || { totalMarks: 0, obtainedMarks: 0, count: 0 };
      entry.totalMarks += Number(sub.maxMarks) || 0;
      entry.obtainedMarks += Number(sub.marksObtained) || 0;
      entry.count += 1;
      subjectMap.set(sub.name, entry);
    });
  });

  const subjectStats = Array.from(subjectMap.entries()).map(([name, data]) => {
    const avgPercentage = data.totalMarks > 0 ? Math.round((data.obtainedMarks / data.totalMarks) * 100) : 0;
    return {
      name,
      avgPercentage,
      studentCount: data.count
    };
  }).sort((a, b) => b.avgPercentage - a.avgPercentage);

  // Class-wise performance stats
  const classBreakdown = availableClasses.map((cls) => {
    const classStudents = students.filter((s) => s.class === cls);
    const count = classStudents.length;
    if (count === 0) return { cls, count: 0, avgPct: 0, topScore: 0 };

    const sum = classStudents.reduce((acc, s) => acc + s.percentage, 0);
    const avgPct = Math.round((sum / count) * 10) / 10;
    const topScore = Math.max(...classStudents.map((s) => s.percentage));

    return { cls, count, avgPct, topScore };
  });

  const distinctionStudents = rankedStudents.filter((s) => s.percentage >= 90);
  const remedialStudents = rankedStudents.filter((s) => s.percentage < 50);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <span>Academic Performance & Percentage Analytics</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          In-depth comparative analysis, subject strengths, class benchmarks, and remediation tracking.
        </p>
      </div>

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-5">
          <CircularProgress percentage={stats.averagePercentage} size={90} strokeWidth={9} subtext="School Avg" />
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Cumulative Percentage
            </span>
            <p className="text-3xl font-black text-slate-900 mt-0.5">{stats.averagePercentage}%</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              {stats.passingRate}% passing standard met
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              School Top Mark
            </span>
            <p className="text-3xl font-black text-amber-600 mt-0.5">{stats.highestPercentage}%</p>
            <p className="text-xs text-slate-600 font-bold mt-1 truncate">
              {stats.topStudent?.name || 'N/A'} ({stats.topStudent?.class})
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Distinction Ratio
            </span>
            <p className="text-3xl font-black text-indigo-600 mt-0.5">
              {stats.totalStudents > 0 ? Math.round((stats.aboveNinetyCount / stats.totalStudents) * 100) : 0}%
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {stats.aboveNinetyCount} students scored ≥90%
            </p>
          </div>
        </div>
      </div>

      {/* Subject-Wise Mastery Comparison */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900">
              Subject-Wise Percentage Benchmarks
            </h2>
            <p className="text-xs text-slate-400">
              Aggregated across all students and classes
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
            {subjectStats.length} Subjects Evaluated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {subjectStats.map((sub, idx) => {
            let barColor = 'bg-emerald-500';
            if (sub.avgPercentage < 60) barColor = 'bg-rose-500';
            else if (sub.avgPercentage < 75) barColor = 'bg-amber-500';
            else if (sub.avgPercentage < 88) barColor = 'bg-sky-500';

            return (
              <div key={sub.name} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-800 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    {sub.name}
                  </span>
                  <div className="text-right">
                    <span className="text-base font-black text-slate-900">{sub.avgPercentage}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-700`}
                    style={{ width: `${Math.min(100, sub.avgPercentage)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Enrolled: {sub.studentCount} students</span>
                  <span>Average Proficiency</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Class by Class Breakdown Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-black text-slate-900">
          Grade & Class Performance Comparison
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {classBreakdown.map((item) => (
            <div key={item.cls} className="p-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900">{item.cls}</h3>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {item.count} Students
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Class Average</span>
                <p className="text-2xl font-black text-slate-900">{item.avgPct}%</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between text-xs">
                <span className="text-slate-500">Highest Score:</span>
                <span className="font-extrabold text-emerald-600">{item.topScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dual Column: Distinction Club vs Attention Required */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distinction Club (≥90%) */}
        <div className="bg-white rounded-3xl border border-emerald-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Distinction Scholars (≥90%)
                </h3>
                <p className="text-xs text-slate-400">{distinctionStudents.length} Students Qualified</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Gold Tier
            </span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {distinctionStudents.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No students with ≥90% yet.</p>
            ) : (
              distinctionStudents.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onViewStudent(s)}
                  className="p-3 rounded-2xl bg-emerald-50/50 hover:bg-emerald-100/50 border border-emerald-100 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-300" />
                    <div>
                      <p className="font-extrabold text-xs text-slate-900">{s.name}</p>
                      <p className="text-[11px] text-slate-500">{s.studentId} • {s.class}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-700">{s.percentage}%</span>
                    <span className="block text-[10px] font-bold text-slate-500">{s.marksObtained}/{s.totalMarks}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Needs Improvement (<50%) */}
        <div className="bg-white rounded-3xl border border-rose-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Academic Remediation Roster (&lt;50%)
                </h3>
                <p className="text-xs text-slate-400">{remedialStudents.length} Students Need Mentoring</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              Needs Help
            </span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {remedialStudents.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                <p className="text-xs font-bold text-slate-700">Zero students below 50%!</p>
                <p className="text-[11px] text-slate-400">All registered students are currently passing.</p>
              </div>
            ) : (
              remedialStudents.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onViewStudent(s)}
                  className="p-3 rounded-2xl bg-rose-50/50 hover:bg-rose-100/50 border border-rose-100 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-rose-300" />
                    <div>
                      <p className="font-extrabold text-xs text-slate-900">{s.name}</p>
                      <p className="text-[11px] text-slate-500">{s.studentId} • {s.class} ({s.section})</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-rose-700">{s.percentage}%</span>
                    <span className="block text-[10px] font-bold text-rose-500">Grade {s.grade}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
