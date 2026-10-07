import React from 'react';
import { Student } from '../types/student';
import { Eye, Edit3, Trash2, Award, ChevronRight } from 'lucide-react';
import { getStatusTheme } from '../utils/calculations';
import { CircularProgress } from './CircularProgress';
import { useAuth } from '../context/AuthContext';

interface StudentCardProps {
  student: Student;
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onView,
  onEdit,
  onDelete
}) => {
  const { isAdmin, openLoginModal } = useAuth();
  const theme = getStatusTheme(student.percentage);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    onEdit(student);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    onDelete(student);
  };

  return (
    <div
      onClick={() => onView(student)}
      className="group relative bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
    >
      {/* Top Banner with Rank & Class */}
      <div className="p-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-lg">
            {student.studentId}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {student.class} • {student.section}
          </span>
        </div>

        {student.rank && (
          <span
            className={`text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
              student.rank === 1
                ? 'bg-amber-100 text-amber-800'
                : student.rank <= 3
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {student.rank === 1 && <Award className="w-3 h-3 text-amber-600" />}
            #{student.rank}
          </span>
        )}
      </div>

      {/* Main Student Header: Avatar, Name, Circular Meter */}
      <div className="px-4 pb-3 flex items-center gap-3">
        <div className="relative shrink-0">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-400 transition-all"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
            {student.name}
          </h3>
          <p className="text-xs text-slate-400 truncate">
            {student.subjects.length} Subjects Evaluated
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${theme.badgeBg}`}>
              Grade {student.grade}
            </span>
            <span className="text-[10px] font-bold text-slate-500 truncate">
              {student.status}
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <CircularProgress
            percentage={student.percentage}
            size={56}
            strokeWidth={6}
            showText={true}
          />
        </div>
      </div>

      {/* Marks Summary & Visual Progress Bar */}
      <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 space-y-2 mt-auto">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Marks Obtained:</span>
          <span className="font-black text-slate-900">
            {student.marksObtained}{' '}
            <span className="font-normal text-slate-400">/ {student.totalMarks}</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${theme.progressBar} rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(100, student.percentage)}%` }}
          />
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-4 py-2.5 bg-white border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
        <span className="group-hover:text-indigo-600 transition-colors flex items-center gap-1">
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={handleEditClick}
            title="Edit Student Marks"
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDeleteClick}
            title="Delete Student"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
