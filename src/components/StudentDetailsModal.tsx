import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Edit3, 
  Trash2, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  GraduationCap, 
  Sparkles,
  BarChart2,
  FileText
} from 'lucide-react';
import { Student } from '../types/student';
import { useAuth } from '../context/AuthContext';
import { useStudents } from '../context/StudentContext';
import { CircularProgress } from './CircularProgress';
import { getStatusTheme } from '../utils/calculations';
import { ReportCardView } from './ReportCardView';

interface StudentDetailsModalProps {
  student: Student;
  onClose: () => void;
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  student,
  onClose
}) => {
  const { isAdmin, openLoginModal } = useAuth();
  const { setStudentToEdit, setStudentToDelete } = useStudents();
  const [showReportCard, setShowReportCard] = useState(false);

  const theme = getStatusTheme(student.percentage);

  const handleEdit = () => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    setStudentToEdit(student);
    onClose();
  };

  const handleDelete = () => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    setStudentToDelete(student);
    onClose();
  };

  if (showReportCard) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print">
        <div className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
          <ReportCardView student={student} onClose={() => setShowReportCard(false)} />
        </div>
      </div>
    );
  }

  // Find highest and lowest scoring subjects
  const sortedSubjects = [...student.subjects].sort((a, b) => {
    const pctA = a.maxMarks > 0 ? a.marksObtained / a.maxMarks : 0;
    const pctB = b.maxMarks > 0 ? b.marksObtained / b.maxMarks : 0;
    return pctB - pctA;
  });
  const bestSubject = sortedSubjects[0];
  const lowestSubject = sortedSubjects[sortedSubjects.length - 1];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 no-print animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 transition-all flex flex-col max-h-[92vh]">
        {/* Header with Student Banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl"
              />
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500 text-white uppercase tracking-wider shadow-sm">
                Rank #{student.rank ?? '1'}
              </span>
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-900/60 px-2.5 py-0.5 rounded-lg border border-indigo-700/50">
                  {student.studentId}
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  {student.class} • Section {student.section}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {student.name}
              </h2>

              <p className="text-xs text-indigo-200 mt-1 max-w-lg">
                {student.remarks || 'Enrolled in academic performance evaluation program.'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${theme.badgeBg}`}>
              Grade {student.grade} • {student.status}
            </span>
            <span className="text-xs text-slate-500">
              Attendance: <strong>{student.attendanceRate ?? 92}%</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReportCard(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Report Card</span>
            </button>
            <button
              onClick={() => {
                setShowReportCard(true);
                setTimeout(() => window.print(), 300);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Percentage & Metrics Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-gradient-to-br from-indigo-50/60 via-purple-50/30 to-pink-50/40 p-5 rounded-2xl border border-indigo-100/80">
            <div className="flex flex-col items-center justify-center text-center p-2">
              <CircularProgress
                percentage={student.percentage}
                size={110}
                strokeWidth={10}
                subtext="Overall Score"
              />
              <p className="mt-2 text-xs font-bold text-slate-700">
                {student.status} Status
              </p>
            </div>

            <div className="md:col-span-2 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Marks Obtained</span>
                  <p className="text-xl font-black text-slate-900">{student.marksObtained}</p>
                  <p className="text-[11px] text-slate-500">Across {student.subjects.length} subjects</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Maximum</span>
                  <p className="text-xl font-black text-slate-900">{student.totalMarks}</p>
                  <p className="text-[11px] text-slate-500">Sum of maximum marks</p>
                </div>
              </div>

              {/* Progress bar with percentage marker */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-600">Calculated Percentage Formula:</span>
                  <span className={theme.text}>
                    ({student.marksObtained} ÷ {student.totalMarks}) × 100 = {student.percentage}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${theme.progressBar} rounded-full transition-all duration-700`}
                    style={{ width: `${Math.min(100, student.percentage)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart: Subject Breakdown & Visual Horizontal Meters */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-600" />
                Performance Chart (Subject-Wise Analysis)
              </h3>
              <span className="text-xs text-slate-500">
                Sorted by syllabus
              </span>
            </div>

            <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
              {student.subjects.map((sub) => {
                const subPct = sub.maxMarks > 0 ? Math.round((sub.marksObtained / sub.maxMarks) * 100) : 0;
                let barColor = 'bg-emerald-500';
                if (subPct < 50) barColor = 'bg-rose-500';
                else if (subPct < 70) barColor = 'bg-amber-500';
                else if (subPct < 85) barColor = 'bg-sky-500';

                return (
                  <div key={sub.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{sub.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">
                          {sub.marksObtained} / {sub.maxMarks} marks
                        </span>
                        <span className="font-extrabold text-slate-900 w-10 text-right">
                          {subPct}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(100, subPct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {bestSubject && (
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-emerald-900 block">Strongest Subject</span>
                  <p className="text-emerald-700 font-medium">
                    {bestSubject.name} ({bestSubject.marksObtained}/{bestSubject.maxMarks} • {Math.round((bestSubject.marksObtained / bestSubject.maxMarks) * 100)}%)
                  </p>
                </div>
              </div>
            )}

            {lowestSubject && (
              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-amber-900 block">Scope for Improvement</span>
                  <p className="text-amber-700 font-medium">
                    {lowestSubject.name} ({lowestSubject.marksObtained}/{lowestSubject.maxMarks} • {Math.round((lowestSubject.marksObtained / lowestSubject.maxMarks) * 100)}%)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Marks</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
