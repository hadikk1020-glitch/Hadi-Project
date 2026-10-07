import { Student, SubjectMark } from '../types/student';

export function calculateMarksAndPercentage(subjects: SubjectMark[]): {
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  grade: Student['grade'];
  status: Student['status'];
} {
  const totalMarks = subjects.reduce((sum, s) => sum + (Number(s.maxMarks) || 0), 0);
  const marksObtained = subjects.reduce((sum, s) => sum + (Number(s.marksObtained) || 0), 0);

  const percentage = totalMarks > 0 
    ? Math.min(100, Math.max(0, Math.round((marksObtained / totalMarks) * 100 * 10) / 10))
    : 0;

  let grade: Student['grade'] = 'F';
  let status: Student['status'] = 'Needs Improvement';

  if (percentage >= 90) {
    grade = 'A+';
    status = 'Distinction';
  } else if (percentage >= 80) {
    grade = 'A';
    status = 'First Class';
  } else if (percentage >= 70) {
    grade = 'B';
    status = 'Second Class';
  } else if (percentage >= 60) {
    grade = 'C';
    status = 'Pass';
  } else if (percentage >= 50) {
    grade = 'D';
    status = 'Pass';
  } else {
    grade = 'F';
    status = 'Needs Improvement';
  }

  return {
    totalMarks,
    marksObtained,
    percentage,
    grade,
    status
  };
}

export function getStatusTheme(percentage: number) {
  if (percentage >= 90) {
    return {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      gradient: 'from-emerald-500 to-teal-600',
      progressBar: 'bg-gradient-to-r from-emerald-400 to-teal-500',
      text: 'text-emerald-600',
      ring: 'stroke-emerald-500',
      label: 'Distinction',
      colorName: 'emerald'
    };
  }
  if (percentage >= 80) {
    return {
      bg: 'bg-violet-50 text-violet-700 border-violet-200',
      badgeBg: 'bg-violet-100 text-violet-800',
      gradient: 'from-violet-500 to-purple-600',
      progressBar: 'bg-gradient-to-r from-violet-400 to-purple-500',
      text: 'text-violet-600',
      ring: 'stroke-violet-500',
      label: 'First Class',
      colorName: 'violet'
    };
  }
  if (percentage >= 70) {
    return {
      bg: 'bg-sky-50 text-sky-700 border-sky-200',
      badgeBg: 'bg-sky-100 text-sky-800',
      gradient: 'from-sky-500 to-blue-600',
      progressBar: 'bg-gradient-to-r from-sky-400 to-blue-500',
      text: 'text-sky-600',
      ring: 'stroke-sky-500',
      label: 'Second Class',
      colorName: 'sky'
    };
  }
  if (percentage >= 50) {
    return {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeBg: 'bg-amber-100 text-amber-800',
      gradient: 'from-amber-500 to-orange-600',
      progressBar: 'bg-gradient-to-r from-amber-400 to-orange-500',
      text: 'text-amber-600',
      ring: 'stroke-amber-500',
      label: 'Pass',
      colorName: 'amber'
    };
  }
  return {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeBg: 'bg-rose-100 text-rose-800',
    gradient: 'from-rose-500 to-red-600',
    progressBar: 'bg-gradient-to-r from-rose-400 to-red-500',
    text: 'text-rose-600',
    ring: 'stroke-rose-500',
    label: 'Needs Improvement',
    colorName: 'rose'
  };
}

export function getDefaultSubjects(): SubjectMark[] {
  return [
    { id: 'sub-1', name: 'Mathematics', marksObtained: 88, maxMarks: 100 },
    { id: 'sub-2', name: 'Physics / Science', marksObtained: 85, maxMarks: 100 },
    { id: 'sub-3', name: 'Computer Science', marksObtained: 94, maxMarks: 100 },
    { id: 'sub-4', name: 'English Language', marksObtained: 90, maxMarks: 100 },
    { id: 'sub-5', name: 'Social Studies', marksObtained: 82, maxMarks: 100 }
  ];
}
