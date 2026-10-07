import { Student } from '../types/student';
import { calculateMarksAndPercentage } from '../utils/calculations';

const rawStudentList = [
  {
    id: 'hadi-stu-001',
    studentId: 'HH-2026-001',
    name: 'Aarav Sharma',
    gender: 'Male' as const,
    class: 'Grade 12',
    section: 'A',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    attendanceRate: 98,
    remarks: 'Consistent class topper with exceptional analytical skills in Math & Coding.',
    subjects: [
      { id: 's1', name: 'Mathematics', marksObtained: 98, maxMarks: 100 },
      { id: 's2', name: 'Physics', marksObtained: 95, maxMarks: 100 },
      { id: 's3', name: 'Chemistry', marksObtained: 92, maxMarks: 100 },
      { id: 's4', name: 'Computer Science', marksObtained: 99, maxMarks: 100 },
      { id: 's5', name: 'English Literature', marksObtained: 94, maxMarks: 100 },
    ]
  },
  {
    id: 'hadi-stu-002',
    studentId: 'HH-2026-002',
    name: 'Zain Hadi Patel',
    gender: 'Male' as const,
    class: 'Grade 12',
    section: 'A',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    attendanceRate: 97,
    remarks: 'Brilliant student and head of school science and robotics club.',
    subjects: [
      { id: 's1', name: 'Mathematics', marksObtained: 96, maxMarks: 100 },
      { id: 's2', name: 'Physics', marksObtained: 94, maxMarks: 100 },
      { id: 's3', name: 'Chemistry', marksObtained: 93, maxMarks: 100 },
      { id: 's4', name: 'Computer Science', marksObtained: 98, maxMarks: 100 },
      { id: 's5', name: 'English Literature', marksObtained: 95, maxMarks: 100 },
    ]
  },
  {
    id: 'hadi-stu-003',
    studentId: 'HH-2026-003',
    name: 'Muhammad Ryan',
    gender: 'Male' as const,
    class: 'Grade 11',
    section: 'A',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    attendanceRate: 95,
    remarks: 'Strong foundation in programming, mathematical logic and science.',
    subjects: [
      { id: 's1', name: 'Mathematics', marksObtained: 91, maxMarks: 100 },
      { id: 's2', name: 'Physics', marksObtained: 88, maxMarks: 100 },
      { id: 's3', name: 'Chemistry', marksObtained: 86, maxMarks: 100 },
      { id: 's4', name: 'Computer Science', marksObtained: 94, maxMarks: 100 },
      { id: 's5', name: 'English Literature', marksObtained: 89, maxMarks: 100 },
    ]
  },
  {
    id: 'hadi-stu-004',
    studentId: 'HH-2026-004',
    name: 'Arjun Deshmukh',
    gender: 'Male' as const,
    class: 'Grade 11',
    section: 'B',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    attendanceRate: 92,
    remarks: 'Dedicated worker with keen creative writing talent and problem solving.',
    subjects: [
      { id: 's1', name: 'Mathematics', marksObtained: 84, maxMarks: 100 },
      { id: 's2', name: 'Physics', marksObtained: 81, maxMarks: 100 },
      { id: 's3', name: 'Chemistry', marksObtained: 80, maxMarks: 100 },
      { id: 's4', name: 'Computer Science', marksObtained: 88, maxMarks: 100 },
      { id: 's5', name: 'English Literature', marksObtained: 92, maxMarks: 100 },
    ]
  },
  {
    id: 'hadi-stu-005',
    studentId: 'HH-2026-005',
    name: 'Ethan Lucas Cole',
    gender: 'Male' as const,
    class: 'Grade 10',
    section: 'A',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    attendanceRate: 89,
    remarks: 'Active in athletics, steadily improving in core sciences.',
    subjects: [
      { id: 's1', name: 'Mathematics', marksObtained: 72, maxMarks: 100 },
      { id: 's2', name: 'Physics', marksObtained: 75, maxMarks: 100 },
      { id: 's3', name: 'Chemistry', marksObtained: 70, maxMarks: 100 },
      { id: 's4', name: 'Computer Science', marksObtained: 80, maxMarks: 100 },
      { id: 's5', name: 'English Literature', marksObtained: 78, maxMarks: 100 },
    ]
  },
  {
    id: 'hadi-stu-006',
    studentId: 'HH-2026-006',
    name: 'Farhan Al-Mansoor',
    gender: 'Male' as const,
    class: 'Grade 10',
    section: 'B',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    attendanceRate: 94,
    remarks: 'Top score in English and Arts, good potential in Math.',
    subjects: [
      { id: 's1', name: 'Mathematics', marksObtained: 76, maxMarks: 100 },
      { id: 's2', name: 'Physics', marksObtained: 68, maxMarks: 100 },
      { id: 's3', name: 'Chemistry', marksObtained: 72, maxMarks: 100 },
      { id: 's4', name: 'Computer Science', marksObtained: 85, maxMarks: 100 },
      { id: 's5', name: 'English Literature', marksObtained: 94, maxMarks: 100 },
    ]
  },
  {
    id: 'hadi-stu-007',
    studentId: 'HH-2026-007',
    name: 'Devraj Singh',
    gender: 'Male' as const,
    class: 'Grade 12',
    section: 'B',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    attendanceRate: 84,
    remarks: 'Needs regular practice in Mathematics and Chemistry numericals.',
    subjects: [
      { id: 's1', name: 'Mathematics', marksObtained: 58, maxMarks: 100 },
      { id: 's2', name: 'Physics', marksObtained: 62, maxMarks: 100 },
      { id: 's3', name: 'Chemistry', marksObtained: 54, maxMarks: 100 },
      { id: 's4', name: 'Computer Science', marksObtained: 70, maxMarks: 100 },
      { id: 's5', name: 'English Literature', marksObtained: 66, maxMarks: 100 },
    ]
  },
  {
    id: 'hadi-stu-008',
    studentId: 'HH-2026-008',
    name: 'Kenji Takahashi',
    gender: 'Male' as const,
    class: 'Grade 10',
    section: 'C',
    avatar: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=150&auto=format&fit=crop&q=80',
    attendanceRate: 78,
    remarks: 'Needs remedial coaching and mentoring to boost passing scores.',
    subjects: [
      { id: 's1', name: 'Mathematics', marksObtained: 42, maxMarks: 100 },
      { id: 's2', name: 'Physics', marksObtained: 45, maxMarks: 100 },
      { id: 's3', name: 'Chemistry', marksObtained: 40, maxMarks: 100 },
      { id: 's4', name: 'Computer Science', marksObtained: 52, maxMarks: 100 },
      { id: 's5', name: 'English Literature', marksObtained: 48, maxMarks: 100 },
    ]
  },
  {
    id: 'hadi-stu-009',
    studentId: 'HH-2026-009',
    name: 'Daniel Mirabella',
    gender: 'Male' as const,
    class: 'Grade 11',
    section: 'C',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&auto=format&fit=crop&q=80',
    attendanceRate: 91,
    remarks: 'Well-rounded student, high marks in lab practicals and coding.',
    subjects: [
      { id: 's1', name: 'Mathematics', marksObtained: 85, maxMarks: 100 },
      { id: 's2', name: 'Physics', marksObtained: 89, maxMarks: 100 },
      { id: 's3', name: 'Chemistry', marksObtained: 87, maxMarks: 100 },
      { id: 's4', name: 'Computer Science', marksObtained: 91, maxMarks: 100 },
      { id: 's5', name: 'English Literature', marksObtained: 88, maxMarks: 100 },
    ]
  }
];

export const INITIAL_STUDENTS: Student[] = rawStudentList.map((item) => {
  const calculated = calculateMarksAndPercentage(item.subjects);
  return {
    ...item,
    totalMarks: calculated.totalMarks,
    marksObtained: calculated.marksObtained,
    percentage: calculated.percentage,
    grade: calculated.grade,
    status: calculated.status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});
