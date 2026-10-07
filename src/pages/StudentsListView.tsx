import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Plus, 
  Grid, 
  List, 
  Download, 
  Trash2, 
  Edit3, 
  Eye, 
  GraduationCap, 
  Sparkles,
  SlidersHorizontal,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { Student, SortField, SortOrder } from '../types/student';
import { useStudents } from '../context/StudentContext';
import { useAuth } from '../context/AuthContext';
import { StudentCard } from '../components/StudentCard';
import { getStatusTheme } from '../utils/calculations';

interface StudentsListViewProps {
  onViewStudent: (student: Student) => void;
}

export const StudentsListView: React.FC<StudentsListViewProps> = ({ onViewStudent }) => {
  const { 
    rankedStudents, 
    availableClasses, 
    availableSections, 
    setIsAddModalOpen, 
    setStudentToEdit, 
    setStudentToDelete,
    filters,
    setFilters
  } = useStudents();
  const { isAdmin, openLoginModal } = useAuth();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Filter & Sort logic
  const filteredStudents = useMemo(() => {
    let result = [...rankedStudents];

    // Search query filter
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q) ||
          s.class.toLowerCase().includes(q)
      );
    }

    // Class filter
    if (filters.classFilter !== 'all') {
      result = result.filter((s) => s.class === filters.classFilter);
    }

    // Section filter
    if (filters.sectionFilter !== 'all') {
      result = result.filter((s) => s.section === filters.sectionFilter);
    }

    // Performance filter
    if (filters.performanceFilter === 'above90') {
      result = result.filter((s) => s.percentage >= 90);
    } else if (filters.performanceFilter === 'above75') {
      result = result.filter((s) => s.percentage >= 75 && s.percentage < 90);
    } else if (filters.performanceFilter === 'above50') {
      result = result.filter((s) => s.percentage >= 50 && s.percentage < 75);
    } else if (filters.performanceFilter === 'below50') {
      result = result.filter((s) => s.percentage < 50);
    }

    // Sorting
    result.sort((a, b) => {
      let comp = 0;
      if (filters.sortBy === 'name') {
        comp = a.name.localeCompare(b.name);
      } else if (filters.sortBy === 'percentage') {
        comp = a.percentage - b.percentage;
      } else if (filters.sortBy === 'marksObtained') {
        comp = a.marksObtained - b.marksObtained;
      } else if (filters.sortBy === 'studentId') {
        comp = a.studentId.localeCompare(b.studentId);
      } else if (filters.sortBy === 'class') {
        comp = a.class.localeCompare(b.class);
      }

      return filters.sortOrder === 'asc' ? comp : -comp;
    });

    return result;
  }, [rankedStudents, filters]);

  const handleSortChange = (field: SortField) => {
    if (filters.sortBy === field) {
      setFilters((prev) => ({
        ...prev,
        sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        sortBy: field,
        sortOrder: field === 'percentage' || field === 'marksObtained' ? 'desc' : 'asc'
      }));
    }
  };

  const handleExportCSV = () => {
    const headers = ['Roll ID', 'Name', 'Class', 'Section', 'Marks Obtained', 'Total Marks', 'Percentage', 'Grade', 'Status'];
    const rows = filteredStudents.map((s) => [
      `"${s.studentId}"`,
      `"${s.name}"`,
      `"${s.class}"`,
      `"${s.section}"`,
      s.marksObtained,
      s.totalMarks,
      `${s.percentage}%`,
      `"${s.grade}"`,
      `"${s.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HADI_HADI_Student_Percentages_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.classFilter !== 'all' ||
    filters.sectionFilter !== 'all' ||
    filters.performanceFilter !== 'all';

  const clearAllFilters = () => {
    setFilters({
      searchQuery: '',
      classFilter: 'all',
      sectionFilter: 'all',
      performanceFilter: 'all',
      sortBy: 'percentage',
      sortOrder: 'desc'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Student Records & Marks
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {filteredStudents.length} of {rankedStudents.length} Students
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student scores, calculate percentages live, search, filter and print reports.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer shadow-2xs"
            title="Download CSV Spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              if (!isAdmin) openLoginModal();
              else setIsAddModalOpen(true);
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Search by student name, roll number, or class..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-500 font-medium"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Class Filter */}
          <div className="md:col-span-2">
            <select
              value={filters.classFilter}
              onChange={(e) => setFilters((prev) => ({ ...prev, classFilter: e.target.value }))}
              className="w-full px-3 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-500"
            >
              <option value="all">All Classes</option>
              {availableClasses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div className="md:col-span-2">
            <select
              value={filters.sectionFilter}
              onChange={(e) => setFilters((prev) => ({ ...prev, sectionFilter: e.target.value }))}
              className="w-full px-3 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-500"
            >
              <option value="all">All Sections</option>
              {availableSections.map((s) => (
                <option key={s} value={s}>
                  Section {s}
                </option>
              ))}
            </select>
          </div>

          {/* Performance Band Filter */}
          <div className="md:col-span-3">
            <select
              value={filters.performanceFilter}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  performanceFilter: e.target.value as any
                }))
              }
              className="w-full px-3 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-500"
            >
              <option value="all">All Performance Bands</option>
              <option value="above90">Distinction (≥90%)</option>
              <option value="above75">First Class (75-89%)</option>
              <option value="above50">Passing (50-74%)</option>
              <option value="below50">Needs Help (&lt;50%)</option>
            </select>
          </div>
        </div>

        {/* Secondary Toolbar: Sort Chips & View Mode Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Sort by:</span>
            <button
              onClick={() => handleSortChange('percentage')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                filters.sortBy === 'percentage'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Percentage</span>
              {filters.sortBy === 'percentage' && (
                <span>{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>

            <button
              onClick={() => handleSortChange('name')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                filters.sortBy === 'name'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Name</span>
              {filters.sortBy === 'name' && (
                <span>{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>

            <button
              onClick={() => handleSortChange('marksObtained')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                filters.sortBy === 'marksObtained'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Marks</span>
              {filters.sortBy === 'marksObtained' && (
                <span>{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>

            <button
              onClick={() => handleSortChange('studentId')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                filters.sortBy === 'studentId'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Roll ID</span>
              {filters.sortBy === 'studentId' && (
                <span>{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 ml-2"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid Card View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Student List Display */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">No students found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No students match your active filters or search terms. Try clearing your filters or enroll a new student.
            </p>
          </div>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onView={onViewStudent}
              onEdit={(s) => setStudentToEdit(s)}
              onDelete={(s) => setStudentToDelete(s)}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Rank</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">Roll ID</th>
                  <th className="p-4">Class & Sec</th>
                  <th className="p-4 text-center">Marks Obtained / Total</th>
                  <th className="p-4 text-center">Percentage</th>
                  <th className="p-4 text-center">Grade & Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredStudents.map((student) => {
                  const theme = getStatusTheme(student.percentage);

                  return (
                    <tr
                      key={student.id}
                      onClick={() => onViewStudent(student)}
                      className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                    >
                      {/* Rank */}
                      <td className="p-4 pl-6">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-xl font-black text-xs ${
                            student.rank === 1
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : student.rank === 2
                              ? 'bg-slate-200 text-slate-800'
                              : student.rank === 3
                              ? 'bg-amber-700/20 text-amber-900'
                              : 'text-slate-400 font-mono'
                          }`}
                        >
                          #{student.rank}
                        </span>
                      </td>

                      {/* Student info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-300"
                          />
                          <div>
                            <span className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 block">
                              {student.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {student.subjects.length} subjects • {student.gender}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Roll ID */}
                      <td className="p-4">
                        <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                          {student.studentId}
                        </span>
                      </td>

                      {/* Class */}
                      <td className="p-4">
                        <span className="font-semibold text-slate-700">
                          {student.class}
                        </span>
                        <span className="block text-[11px] text-slate-400">
                          Section {student.section}
                        </span>
                      </td>

                      {/* Marks */}
                      <td className="p-4 text-center">
                        <span className="font-black text-slate-900 text-sm">
                          {student.marksObtained}
                        </span>
                        <span className="text-slate-400 text-xs font-normal">
                          {' '}/ {student.totalMarks}
                        </span>
                      </td>

                      {/* Percentage & Mini Progress Bar */}
                      <td className="p-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`text-base font-black ${theme.text}`}>
                            {student.percentage}%
                          </span>
                          <div className="w-20 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div
                              className={`h-full ${theme.progressBar} rounded-full`}
                              style={{ width: `${Math.min(100, student.percentage)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Grade & Status */}
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${theme.badgeBg}`}>
                          {student.grade} • {student.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => onViewStudent(student)}
                            title="View Student"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (!isAdmin) openLoginModal();
                              else setStudentToEdit(student);
                            }}
                            title="Edit Student Marks"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (!isAdmin) openLoginModal();
                              else setStudentToDelete(student);
                            }}
                            title="Delete Student"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
