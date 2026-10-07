export interface SubjectMark {
  id: string;
  name: string;
  marksObtained: number;
  maxMarks: number;
}

export interface Student {
  id: string;
  studentId: string; // Roll number e.g. "HH-101"
  name: string;
  email?: string;
  gender: 'Male' | 'Female' | 'Other';
  class: string; // e.g. "Grade 10", "Grade 12"
  section: string; // "A", "B", "C", "D"
  avatar: string;
  subjects: SubjectMark[];
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  status: 'Distinction' | 'First Class' | 'Second Class' | 'Pass' | 'Needs Improvement';
  rank?: number;
  remarks?: string;
  attendanceRate?: number; // e.g. 94%
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  averagePercentage: number;
  highestPercentage: number;
  lowestPercentage: number;
  aboveNinetyCount: number;
  belowFiftyCount: number;
  passingRate: number;
  topStudent?: Student;
}

export type SortField = 'name' | 'percentage' | 'marksObtained' | 'studentId' | 'class';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  searchQuery: string;
  classFilter: string;
  sectionFilter: string;
  performanceFilter: 'all' | 'above90' | 'above75' | 'above50' | 'below50';
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface AdminUser {
  username: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  isAuthenticated: boolean;
}
