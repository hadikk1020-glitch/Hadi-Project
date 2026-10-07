import React from 'react';
import { Student } from '../types/student';
import { Printer, Download, Award, CheckCircle2, School, X, Sparkles } from 'lucide-react';
import { getStatusTheme } from '../utils/calculations';

interface ReportCardViewProps {
  student: Student;
  onClose?: () => void;
}

export const ReportCardView: React.FC<ReportCardViewProps> = ({ student, onClose }) => {
  const theme = getStatusTheme(student.percentage);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden printable-card max-w-4xl mx-auto">
      {/* Action Toolbar (Hidden during print) */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-sm">
            Official Academic Report • {student.name} ({student.studentId})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report Card</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="p-6 sm:p-10 space-y-6 bg-white text-slate-800">
        {/* Institutional Header */}
        <div className="border-b-2 border-slate-800 pb-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-700 via-purple-700 to-pink-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
                HH
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  HADI HADI ACADEMY & COLLEGES
                </h1>
                <p className="text-xs uppercase tracking-widest font-bold text-indigo-700">
                  Board of Secondary & Higher Academic Examinations
                </p>
                <p className="text-xs text-slate-500">
                  Official Student Progress & Percentage Statement • Academic Year 2025–2026
                </p>
              </div>
            </div>

            {/* Rank / Grade Badge */}
            <div className="text-right hidden sm:block">
              <div className="inline-block px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">
                  Overall Result
                </span>
                <span className="text-lg font-black">{student.status}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">
                Class Rank: <span className="font-bold text-slate-900">#{student.rank ?? '1'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Student Bio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="sm:col-span-1 flex justify-center sm:justify-start">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-600 shadow-xs"
            />
          </div>

          <div className="sm:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-xs">
            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Student Name</span>
              <span className="font-black text-sm text-slate-900">{student.name}</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Student ID / Roll No</span>
              <span className="font-mono font-bold text-sm text-indigo-700">{student.studentId}</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Class & Section</span>
              <span className="font-bold text-slate-800 text-sm">
                {student.class} — Sec {student.section}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Gender</span>
              <span className="font-semibold text-slate-700">{student.gender}</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Attendance</span>
              <span className="font-semibold text-slate-700">{student.attendanceRate ?? 95}% Present</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Issue Date</span>
              <span className="font-semibold text-slate-700">
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Subject-Wise Performance Table */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center justify-between">
            <span>Academic Performance Breakdown</span>
            <span className="text-xs font-normal text-slate-500 normal-case">
              Calculated on standard 100-mark percentile scale
            </span>
          </h2>

          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[11px]">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Subject Title</th>
                  <th className="p-3 text-center">Max Marks</th>
                  <th className="p-3 text-center">Marks Obtained</th>
                  <th className="p-3 text-center">Percentage</th>
                  <th className="p-3 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {student.subjects.map((sub, index) => {
                  const subPct = sub.maxMarks > 0 ? Math.round((sub.marksObtained / sub.maxMarks) * 100) : 0;
                  let gradeLetter = 'F';
                  if (subPct >= 90) gradeLetter = 'A+';
                  else if (subPct >= 80) gradeLetter = 'A';
                  else if (subPct >= 70) gradeLetter = 'B';
                  else if (subPct >= 60) gradeLetter = 'C';
                  else if (subPct >= 50) gradeLetter = 'D';

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/50">
                      <td className="p-3 text-slate-400 font-mono">{index + 1}</td>
                      <td className="p-3 font-bold text-slate-900">{sub.name}</td>
                      <td className="p-3 text-center text-slate-600">{sub.maxMarks}</td>
                      <td className="p-3 text-center font-bold text-slate-900">{sub.marksObtained}</td>
                      <td className="p-3 text-center">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-2 hidden sm:block overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full"
                              style={{ width: `${Math.min(100, subPct)}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-800">{subPct}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded font-black text-xs bg-slate-100 text-slate-800">
                          {gradeLetter}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {/* Total Marks & Overall Percentage Summary Row */}
                <tr className="bg-indigo-50/50 font-bold border-t-2 border-indigo-200">
                  <td colSpan={2} className="p-3 text-sm font-black text-indigo-950 uppercase">
                    Cumulative Total
                  </td>
                  <td className="p-3 text-center text-sm font-black text-slate-800">
                    {student.totalMarks}
                  </td>
                  <td className="p-3 text-center text-sm font-black text-indigo-700">
                    {student.marksObtained}
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-base font-black text-indigo-900">
                      {student.percentage}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${theme.badgeBg}`}>
                      {student.grade}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculation summary card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Score Calculation</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">
              {student.marksObtained} / {student.totalMarks}
            </p>
            <p className="text-[11px] text-slate-500">Aggregate marks across all subjects</p>
          </div>

          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40">
            <span className="text-[10px] uppercase font-bold text-indigo-600">Calculated Percentage</span>
            <p className="text-2xl font-black text-indigo-900 mt-0.5">
              {student.percentage}%
            </p>
            <p className="text-[11px] text-indigo-700">Formula: (Obtained ÷ Total) × 100</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <span className="text-[10px] uppercase font-bold text-slate-400">Performance Standing</span>
            <p className="text-lg font-black text-emerald-700 mt-0.5">
              {student.status}
            </p>
            <p className="text-[11px] text-slate-500">Grade Letter: {student.grade}</p>
          </div>
        </div>

        {/* Remarks and Authentication Signatures */}
        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Academic Counselor / Teacher Remarks
            </span>
            <p className="text-xs italic text-slate-700 leading-relaxed">
              "{student.remarks || 'Candidate has demonstrated steady dedication and commendable analytical proficiency across academic coursework.'}"
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 text-center border-t border-slate-200">
            <div>
              <div className="h-10 flex items-end justify-center">
                <span className="font-serif italic text-sm text-slate-700">H. K. Sharma</span>
              </div>
              <div className="border-t border-slate-400 pt-1 text-[11px] font-bold text-slate-600">
                Class Teacher Signature
              </div>
            </div>

            <div>
              <div className="h-10 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-700 text-[8px] font-black text-indigo-700 flex flex-col items-center justify-center uppercase leading-none">
                  <span>HADI</span>
                  <span className="text-[6px]">SEAL</span>
                  <span>2026</span>
                </div>
              </div>
              <div className="border-t border-slate-400 pt-1 text-[11px] font-bold text-slate-600">
                Official Institutional Seal
              </div>
            </div>

            <div>
              <div className="h-10 flex items-end justify-center">
                <span className="font-serif italic text-sm text-indigo-900 font-bold">Hadi Administrator</span>
              </div>
              <div className="border-t border-slate-400 pt-1 text-[11px] font-bold text-slate-600">
                Controller of Examinations
              </div>
            </div>
          </div>
        </div>

        {/* Footer brand verification */}
        <div className="text-center text-[10px] text-slate-400 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span>System Generated by HADI HADI Percentage Portal</span>
          <span>Security Verification Key: HH-{student.id.toUpperCase().slice(-6)}</span>
        </div>
      </div>
    </div>
  );
};
