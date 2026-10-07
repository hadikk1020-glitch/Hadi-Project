import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Award, 
  Search, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  School,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { useStudents } from '../context/StudentContext';
import { Student } from '../types/student';
import { ReportCardView } from '../components/ReportCardView';
import { getStatusTheme } from '../utils/calculations';

interface ReportsViewProps {
  onViewStudent: (student: Student) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onViewStudent }) => {
  const { rankedStudents, availableClasses, stats } = useStudents();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    rankedStudents.length > 0 ? rankedStudents[0].id : ''
  );
  const [reportType, setReportType] = useState<'individual' | 'merit'>('individual');
  const [classFilter, setClassFilter] = useState('all');

  const selectedStudent = rankedStudents.find((s) => s.id === selectedStudentId) || rankedStudents[0];

  const filteredMeritStudents = rankedStudents.filter((s) => {
    if (classFilter !== 'all') return s.class === classFilter;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Header and Switcher (Hidden in print) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            <span>Academic Performance Reports & Merit Registry</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate and print individual student performance report cards or class merit sheets.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setReportType('individual')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              reportType === 'individual'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Individual Report Card
          </button>
          <button
            onClick={() => setReportType('merit')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              reportType === 'merit'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Institutional Merit Board
          </button>
        </div>
      </div>

      {reportType === 'individual' ? (
        <div className="space-y-6">
          {/* Student Selector Card (No-print) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 no-print">
            <div className="flex-1 max-w-md">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Student for Individual Report:
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-500"
              >
                {rankedStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    #{s.rank} — {s.name} ({s.studentId} • {s.class} • {s.percentage}%)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Card</span>
              </button>
            </div>
          </div>

          {/* Render Official Report Card */}
          {selectedStudent && <ReportCardView student={selectedStudent} />}
        </div>
      ) : (
        /* Merit Board & Master Tabulation Sheet */
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">Filter by Class:</label>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
              >
                <option value="all">All Classes & Grades</option>
                {availableClasses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Merit Roster</span>
            </button>
          </div>

          {/* Printable Merit Sheet */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden printable-card p-6 sm:p-8">
            <div className="border-b-2 border-slate-800 pb-5 mb-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase">
                  HADI HADI ACADEMY — OFFICIAL MERIT SHEET
                </h2>
                <p className="text-xs font-bold text-indigo-700 tracking-wider uppercase">
                  Annual Academic Ranking and Percentage Tabulation Statement
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Active Filter: {classFilter === 'all' ? 'All Classes' : classFilter} • Total Candidates: {filteredMeritStudents.length}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-mono">Date: {new Date().toLocaleDateString()}</span>
                <span className="px-3 py-1 bg-slate-900 text-white font-bold rounded-lg text-xs">
                  Controller Certified
                </span>
              </div>
            </div>

            {/* Merit Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="p-3 pl-4">Rank</th>
                    <th className="p-3">Candidate Name</th>
                    <th className="p-3">Roll ID</th>
                    <th className="p-3">Class</th>
                    <th className="p-3 text-center">Marks Obtained</th>
                    <th className="p-3 text-center">Total Max</th>
                    <th className="p-3 text-center">Calculated %</th>
                    <th className="p-3 text-center">Grade</th>
                    <th className="p-3 pr-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {filteredMeritStudents.map((s, index) => {
                    const theme = getStatusTheme(s.percentage);
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/60">
                        <td className="p-3 pl-4 font-black">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs ${
                              index === 0
                                ? 'bg-amber-400 text-amber-950 font-black'
                                : index === 1
                                ? 'bg-slate-300 text-slate-900 font-black'
                                : index === 2
                                ? 'bg-amber-700 text-amber-100 font-black'
                                : 'text-slate-600 font-mono'
                            }`}
                          >
                            #{index + 1}
                          </span>
                        </td>
                        <td className="p-3 font-extrabold text-slate-900">{s.name}</td>
                        <td className="p-3 font-mono font-bold text-indigo-700">{s.studentId}</td>
                        <td className="p-3 text-slate-600">{s.class} ({s.section})</td>
                        <td className="p-3 text-center font-bold text-slate-900">{s.marksObtained}</td>
                        <td className="p-3 text-center text-slate-500">{s.totalMarks}</td>
                        <td className="p-3 text-center font-black text-indigo-900 text-sm">
                          {s.percentage}%
                        </td>
                        <td className="p-3 text-center font-black">{s.grade}</td>
                        <td className="p-3 pr-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${theme.badgeBg}`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Signature Block */}
            <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-300 text-center text-xs">
              <div>
                <div className="h-10"></div>
                <div className="border-t border-slate-400 pt-1 font-bold text-slate-700">
                  Head of Academic Verification
                </div>
              </div>
              <div>
                <div className="h-10"></div>
                <div className="border-t border-slate-400 pt-1 font-bold text-slate-700">
                  Dean / Examination Controller Signature
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
