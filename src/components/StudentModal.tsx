import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  Check, 
  GraduationCap, 
  Camera, 
  RefreshCw,
  Award,
  BookOpen
} from 'lucide-react';
import { Student, SubjectMark } from '../types/student';
import { useStudents } from '../context/StudentContext';
import { calculateMarksAndPercentage, getDefaultSubjects, getStatusTheme } from '../utils/calculations';
import { CircularProgress } from './CircularProgress';
import confetti from 'canvas-confetti';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: Student | null;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&auto=format&fit=crop&q=80',
];

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  studentToEdit
}) => {
  const { addStudent, updateStudent, availableClasses, availableSections } = useStudents();

  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [selectedClass, setSelectedClass] = useState('Grade 10');
  const [section, setSection] = useState('A');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);
  const [remarks, setRemarks] = useState('');
  const [attendanceRate, setAttendanceRate] = useState<number>(92);
  const [subjects, setSubjects] = useState<SubjectMark[]>(getDefaultSubjects());
  const [error, setError] = useState<string | null>(null);

  // Sync state when editing existing student
  useEffect(() => {
    if (studentToEdit) {
      setName(studentToEdit.name);
      setStudentId(studentToEdit.studentId);
      setSelectedClass(studentToEdit.class);
      setSection(studentToEdit.section);
      setGender(studentToEdit.gender);
      setAvatar(studentToEdit.avatar);
      setRemarks(studentToEdit.remarks || '');
      setAttendanceRate(studentToEdit.attendanceRate ?? 90);
      setSubjects(
        studentToEdit.subjects.map((s) => ({
          ...s,
          marksObtained: Number(s.marksObtained),
          maxMarks: Number(s.maxMarks)
        }))
      );
    } else {
      // Auto-generate fresh Roll number for new student
      const randomNum = Math.floor(100 + Math.random() * 900);
      setName('');
      setStudentId(`HH-2026-${randomNum}`);
      setSelectedClass('Grade 10');
      setSection('A');
      setGender('Male');
      setAvatar(PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)]);
      setRemarks('');
      setAttendanceRate(95);
      setSubjects(getDefaultSubjects());
    }
    setError(null);
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  // Real-time automatic percentage & marks calculation
  const calculated = calculateMarksAndPercentage(subjects);
  const theme = getStatusTheme(calculated.percentage);

  const handleSubjectChange = (id: string, field: 'name' | 'marksObtained' | 'maxMarks', value: string | number) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== id) return sub;
        if (field === 'name') {
          return { ...sub, name: String(value) };
        } else {
          const num = Number(value);
          return { ...sub, [field]: isNaN(num) ? 0 : Math.max(0, num) };
        }
      })
    );
  };

  const handleAddSubject = () => {
    const newId = `sub-${Date.now()}`;
    setSubjects((prev) => [
      ...prev,
      { id: newId, name: `Subject ${prev.length + 1}`, marksObtained: 75, maxMarks: 100 }
    ]);
  };

  const handleRemoveSubject = (id: string) => {
    if (subjects.length <= 1) {
      setError('Student must have at least one subject.');
      return;
    }
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const handleResetSubjects = () => {
    setSubjects(getDefaultSubjects());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError('Please provide student full name.');
      return;
    }
    if (!studentId.trim()) {
      setError('Please provide student roll number / ID.');
      return;
    }

    // Check individual subject bounds
    for (const sub of subjects) {
      if (!sub.name.trim()) {
        setError('All subjects must have a valid title.');
        return;
      }
      if (sub.marksObtained > sub.maxMarks) {
        setError(`Marks obtained in "${sub.name}" (${sub.marksObtained}) cannot exceed maximum marks (${sub.maxMarks})!`);
        return;
      }
    }

    if (studentToEdit) {
      const res = updateStudent(studentToEdit.id, {
        name: name.trim(),
        studentId: studentId.trim(),
        class: selectedClass,
        section,
        gender,
        avatar,
        remarks: remarks.trim(),
        attendanceRate: Number(attendanceRate) || 90,
        subjects
      });
      if (!res.success) {
        setError(res.error || 'Failed to update student');
        return;
      }
    } else {
      const res = addStudent({
        name: name.trim(),
        studentId: studentId.trim(),
        class: selectedClass,
        section,
        gender,
        avatar,
        remarks: remarks.trim(),
        attendanceRate: Number(attendanceRate) || 90,
        subjects
      });
      if (!res.success) {
        setError(res.error || 'Failed to add student');
        return;
      }

      // Celebrate high achievers
      if (calculated.percentage >= 90) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 no-print animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 transition-all flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:px-7 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {studentToEdit ? 'Edit Student Details' : 'Add New Student'}
              </h2>
              <p className="text-xs text-indigo-200">
                HADI HADI Academic Records & Percentage System
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Calculation Banner */}
        <div className="bg-gradient-to-r from-slate-50 to-indigo-50/50 border-b border-indigo-100/70 p-4 sm:px-7 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <CircularProgress
              percentage={calculated.percentage}
              size={64}
              strokeWidth={7}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Live Calculation:
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${theme.badgeBg}`}>
                  {calculated.grade} • {calculated.status}
                </span>
              </div>
              <p className="text-xl font-extrabold text-slate-800">
                {calculated.marksObtained}{' '}
                <span className="text-xs font-medium text-slate-500">
                  out of {calculated.totalMarks} marks
                </span>{' '}
                = <span className={`font-black ${theme.text}`}>{calculated.percentage}%</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Formula: (Obtained ÷ Total) × 100</span>
          </div>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Basic Student Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              Student Profile & Identification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Zain Hadi"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student ID / Roll Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. HH-2026-081"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class / Grade <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-500 font-semibold"
                >
                  {availableClasses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="Grade 9">Grade 9</option>
                  <option value="College Year 1">College Year 1</option>
                  <option value="College Year 2">College Year 2</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  {['A', 'B', 'C', 'D'].map((sec) => (
                    <button
                      type="button"
                      key={sec}
                      onClick={() => setSection(sec)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        section === sec
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Section {sec}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender
                </label>
                <div className="flex gap-2">
                  {(['Male', 'Female', 'Other'] as const).map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        gender === g
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attendance Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={attendanceRate}
                  onChange={(e) => setAttendanceRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Profile Photo Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Profile Photo
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <img
                  src={avatar}
                  alt="Student Avatar"
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-full text-[10px]">
                  <Camera className="w-3 h-3" />
                </span>
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-xs text-slate-500 mb-1.5">Pick a preset or paste avatar URL:</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setAvatar(preset)}
                      className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition-transform hover:scale-105 cursor-pointer ${
                        avatar === preset ? 'border-indigo-600 ring-2 ring-indigo-300' : 'border-transparent'
                      }`}
                    >
                      <img src={preset} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="Or enter custom image URL..."
                  className="mt-2 w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Subject-wise Marks Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Subject-Wise Marks & Maximum Marks
                </h3>
                <p className="text-xs text-slate-500">
                  Enter marks obtained and max marks. Percentage updates live.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetSubjects}
                  title="Reset to 5 core subjects"
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Subjects</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Subject</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 bg-slate-50/70 p-3 rounded-2xl border border-slate-200">
              <div className="hidden sm:grid sm:grid-cols-12 gap-3 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span className="col-span-5">Subject Name</span>
                <span className="col-span-3 text-center">Marks Obtained</span>
                <span className="col-span-3 text-center">Max Marks</span>
                <span className="col-span-1 text-center">Action</span>
              </div>

              {subjects.map((sub, index) => {
                const subPercentage = sub.maxMarks > 0 ? Math.round((sub.marksObtained / sub.maxMarks) * 100) : 0;
                const isOverMax = sub.marksObtained > sub.maxMarks;

                return (
                  <div
                    key={sub.id}
                    className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 p-3 bg-white rounded-xl border transition-all items-center ${
                      isOverMax ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  >
                    <div className="col-span-1 sm:col-span-5">
                      <label className="sm:hidden text-[10px] font-bold text-slate-400 uppercase">Subject</label>
                      <input
                        type="text"
                        required
                        value={sub.name}
                        onChange={(e) => handleSubjectChange(sub.id, 'name', e.target.value)}
                        placeholder="Subject Name"
                        className="w-full px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:border-indigo-500"
                      />
                    </div>

                    <div className="col-span-1 sm:col-span-3">
                      <label className="sm:hidden text-[10px] font-bold text-slate-400 uppercase">Marks</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max={sub.maxMarks}
                          required
                          value={sub.marksObtained}
                          onChange={(e) => handleSubjectChange(sub.id, 'marksObtained', e.target.value)}
                          className={`w-full px-3 py-1.5 text-xs font-bold text-center border rounded-lg focus:outline-hidden ${
                            isOverMax
                              ? 'bg-rose-50 border-rose-400 text-rose-700'
                              : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500'
                          }`}
                        />
                        {isOverMax && (
                          <span className="text-[10px] text-rose-600 block mt-0.5 text-center font-bold">
                            Cannot exceed {sub.maxMarks}!
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-3">
                      <label className="sm:hidden text-[10px] font-bold text-slate-400 uppercase">Max Marks</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="1"
                          required
                          value={sub.maxMarks}
                          onChange={(e) => handleSubjectChange(sub.id, 'maxMarks', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs font-semibold text-center bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:border-indigo-500"
                        />
                        <span className="text-[11px] font-bold text-slate-400 shrink-0">
                          {subPercentage}%
                        </span>
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(sub.id)}
                        disabled={subjects.length <= 1}
                        className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Teacher's Remarks / Academic Evaluation
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Excellent conceptual clarity. Recommended for honors track."
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-500 font-medium"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-4 sm:px-7 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{studentToEdit ? 'Save Changes' : 'Calculate & Save Student'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
