import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Student } from '../types/student';
import { useStudents } from '../context/StudentContext';

interface ConfirmDeleteModalProps {
  student: Student | null;
  onClose: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  student,
  onClose
}) => {
  const { deleteStudent } = useStudents();

  if (!student) return null;

  const handleConfirm = () => {
    deleteStudent(student.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900">
              Confirm Student Deletion
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to remove this student record from HADI HADI?
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3 text-left">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{student.name}</p>
              <p className="text-[11px] text-slate-500">
                {student.studentId} • {student.class} ({student.percentage}%)
              </p>
            </div>
          </div>

          <p className="text-[11px] text-rose-600 font-medium">
            This action cannot be undone. All marks and percentage history for this student will be deleted.
          </p>

          <div className="flex gap-2.5 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Permanently</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
