import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Student, SubjectMark, DashboardStats, FilterState } from '../types/student';
import { INITIAL_STUDENTS } from '../data/seedStudents';
import { calculateMarksAndPercentage } from '../utils/calculations';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StudentContextType {
  students: Student[];
  rankedStudents: Student[];
  stats: DashboardStats;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  addStudent: (data: Omit<Student, 'id' | 'totalMarks' | 'marksObtained' | 'percentage' | 'grade' | 'status' | 'createdAt' | 'updatedAt'>) => { success: boolean; error?: string };
  updateStudent: (id: string, data: Partial<Omit<Student, 'id' | 'totalMarks' | 'marksObtained' | 'percentage' | 'grade' | 'status'>>) => { success: boolean; error?: string };
  deleteStudent: (id: string) => void;
  getStudentById: (id: string) => Student | undefined;
  resetToDefaultData: () => void;
  availableClasses: string[];
  availableSections: string[];
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  selectedStudentForDetail: Student | null;
  setSelectedStudentForDetail: (student: Student | null) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  studentToEdit: Student | null;
  setStudentToEdit: (student: Student | null) => void;
  studentToDelete: Student | null;
  setStudentToDelete: (student: Student | null) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const stored = localStorage.getItem('hadi_hadi_students_v3');
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.removeItem('hadi_hadi_students_v2');
      return INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    classFilter: 'all',
    sectionFilter: 'all',
    performanceFilter: 'all',
    sortBy: 'percentage',
    sortOrder: 'desc'
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    try {
      localStorage.setItem('hadi_hadi_students_v3', JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  }, [students]);

  // Compute ranks for all students based on percentage descending
  const rankedStudents = useMemo(() => {
    const sorted = [...students].sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }
      return b.marksObtained - a.marksObtained;
    });

    return sorted.map((s, index) => ({
      ...s,
      rank: index + 1
    }));
  }, [students]);

  // Compute overall dashboard statistics
  const stats: DashboardStats = useMemo(() => {
    if (students.length === 0) {
      return {
        totalStudents: 0,
        averagePercentage: 0,
        highestPercentage: 0,
        lowestPercentage: 0,
        aboveNinetyCount: 0,
        belowFiftyCount: 0,
        passingRate: 0,
        topStudent: undefined
      };
    }

    const totalStudents = students.length;
    const percentages = students.map((s) => s.percentage);
    const sumPercentage = percentages.reduce((acc, p) => acc + p, 0);
    const averagePercentage = Math.round((sumPercentage / totalStudents) * 10) / 10;
    const highestPercentage = Math.max(...percentages);
    const lowestPercentage = Math.min(...percentages);

    const aboveNinetyCount = students.filter((s) => s.percentage >= 90).length;
    const belowFiftyCount = students.filter((s) => s.percentage < 50).length;
    const passingCount = students.filter((s) => s.percentage >= 50).length;
    const passingRate = Math.round((passingCount / totalStudents) * 100);

    const topStudent = rankedStudents[0];

    return {
      totalStudents,
      averagePercentage,
      highestPercentage,
      lowestPercentage,
      aboveNinetyCount,
      belowFiftyCount,
      passingRate,
      topStudent
    };
  }, [students, rankedStudents]);

  const availableClasses = useMemo(() => {
    const set = new Set(students.map((s) => s.class));
    ['Grade 10', 'Grade 11', 'Grade 12'].forEach((c) => set.add(c));
    return Array.from(set).sort();
  }, [students]);

  const availableSections = useMemo(() => {
    const set = new Set(students.map((s) => s.section));
    ['A', 'B', 'C', 'D'].forEach((s) => set.add(s));
    return Array.from(set).sort();
  }, [students]);

  const validateSubjects = (subjects: SubjectMark[]): { valid: boolean; error?: string } => {
    if (!subjects || subjects.length === 0) {
      return { valid: false, error: 'At least one subject is required.' };
    }
    for (const sub of subjects) {
      if (!sub.name.trim()) {
        return { valid: false, error: 'All subjects must have a name.' };
      }
      if (sub.maxMarks <= 0) {
        return { valid: false, error: `Maximum marks for ${sub.name} must be greater than 0.` };
      }
      if (sub.marksObtained < 0) {
        return { valid: false, error: `Marks obtained for ${sub.name} cannot be negative.` };
      }
      if (sub.marksObtained > sub.maxMarks) {
        return { valid: false, error: `Marks obtained (${sub.marksObtained}) in ${sub.name} cannot exceed max marks (${sub.maxMarks})!` };
      }
    }
    return { valid: true };
  };

  const addStudent = (
    data: Omit<Student, 'id' | 'totalMarks' | 'marksObtained' | 'percentage' | 'grade' | 'status' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!data.name.trim()) {
      return { success: false, error: 'Student name is required.' };
    }
    if (!data.studentId.trim()) {
      return { success: false, error: 'Student ID / Roll number is required.' };
    }

    // Check duplicate student ID
    const exists = students.some(
      (s) => s.studentId.trim().toLowerCase() === data.studentId.trim().toLowerCase()
    );
    if (exists) {
      return { success: false, error: `Student ID "${data.studentId}" is already assigned to another student.` };
    }

    const subjectValidation = validateSubjects(data.subjects);
    if (!subjectValidation.valid) {
      return { success: false, error: subjectValidation.error };
    }

    const calculated = calculateMarksAndPercentage(data.subjects);
    const newStudent: Student = {
      ...data,
      id: `hadi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      totalMarks: calculated.totalMarks,
      marksObtained: calculated.marksObtained,
      percentage: calculated.percentage,
      grade: calculated.grade,
      status: calculated.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setStudents((prev) => [newStudent, ...prev]);
    showToast(`Student "${newStudent.name}" enrolled with ${newStudent.percentage}%!`, 'success');
    return { success: true };
  };

  const updateStudent = (
    id: string,
    data: Partial<Omit<Student, 'id' | 'totalMarks' | 'marksObtained' | 'percentage' | 'grade' | 'status'>>
  ) => {
    const existing = students.find((s) => s.id === id);
    if (!existing) {
      return { success: false, error: 'Student not found.' };
    }

    if (data.studentId && data.studentId.trim().toLowerCase() !== existing.studentId.toLowerCase()) {
      const duplicate = students.some(
        (s) => s.id !== id && s.studentId.trim().toLowerCase() === data.studentId!.trim().toLowerCase()
      );
      if (duplicate) {
        return { success: false, error: `Student ID "${data.studentId}" is already taken.` };
      }
    }

    const newSubjects = data.subjects || existing.subjects;
    const subjectValidation = validateSubjects(newSubjects);
    if (!subjectValidation.valid) {
      return { success: false, error: subjectValidation.error };
    }

    const calculated = calculateMarksAndPercentage(newSubjects);

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const updated: Student = {
          ...s,
          ...data,
          subjects: newSubjects,
          totalMarks: calculated.totalMarks,
          marksObtained: calculated.marksObtained,
          percentage: calculated.percentage,
          grade: calculated.grade,
          status: calculated.status,
          updatedAt: new Date().toISOString()
        };
        // Also update selected student if currently in view modal
        if (selectedStudentForDetail?.id === id) {
          setSelectedStudentForDetail(updated);
        }
        return updated;
      })
    );

    showToast(`Updated "${data.name || existing.name}" successfully (${calculated.percentage}%)!`, 'success');
    return { success: true };
  };

  const deleteStudent = (id: string) => {
    const s = students.find((item) => item.id === id);
    setStudents((prev) => prev.filter((item) => item.id !== id));
    if (selectedStudentForDetail?.id === id) {
      setSelectedStudentForDetail(null);
    }
    showToast(`Student "${s?.name || 'Record'}" deleted.`, 'info');
  };

  const getStudentById = (id: string) => {
    return rankedStudents.find((s) => s.id === id);
  };

  const resetToDefaultData = () => {
    setStudents(INITIAL_STUDENTS);
    localStorage.removeItem('hadi_hadi_students_v3');
    localStorage.removeItem('hadi_hadi_students_v2');
    showToast('Reset database to HADI HADI demonstration records.', 'info');
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        rankedStudents,
        stats,
        filters,
        setFilters,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudentById,
        resetToDefaultData,
        availableClasses,
        availableSections,
        toasts,
        showToast,
        removeToast,
        selectedStudentForDetail,
        setSelectedStudentForDetail,
        isAddModalOpen,
        setIsAddModalOpen,
        studentToEdit,
        setStudentToEdit,
        studentToDelete,
        setStudentToDelete
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export function useStudents() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
}
