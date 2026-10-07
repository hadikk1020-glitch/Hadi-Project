import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Database, 
  RefreshCw, 
  Award, 
  Save, 
  Check, 
  School,
  Lock,
  Download,
  Upload,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStudents } from '../context/StudentContext';

export const SettingsView: React.FC = () => {
  const { user, isAdmin, updateAdminProfile, openLoginModal } = useAuth();
  const { resetToDefaultData, showToast, students } = useStudents();

  const [institutionName, setInstitutionName] = useState('HADI HADI Academy & College');
  const [examSession, setExamSession] = useState('Academic Year 2025–2026');
  const [adminName, setAdminName] = useState(user?.name || 'Hadi Controller');
  const [adminEmail, setAdminEmail] = useState(user?.email || 'admin@hadi.edu');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    updateAdminProfile({
      name: adminName,
      email: adminEmail
    });
    setIsSaved(true);
    showToast('Administrator settings saved successfully.', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(students, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `HADI_HADI_Student_Data_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup JSON downloaded successfully.', 'success');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" />
          <span>System & Examination Settings</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure institutional identity, grading percentages, admin credentials, and database backups.
        </p>
      </div>

      {/* Institution Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Institution Identity</h2>
            <p className="text-xs text-slate-400">Printed on official reports and certificate seals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official Institution Title
            </label>
            <input
              type="text"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Academic Term / Session
            </label>
            <input
              type="text"
              value={examSession}
              onChange={(e) => setExamSession(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Grading Scale & Percentage Thresholds */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">
              Grading Scale & Percentage Rubric
            </h2>
            <p className="text-xs text-slate-400">
              Current HADI HADI academic evaluation benchmarks
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-xs font-black text-emerald-800 block">Grade A+</span>
            <span className="text-sm font-black text-emerald-900 mt-1 block">≥ 90%</span>
            <span className="text-[10px] font-bold text-emerald-700">Distinction</span>
          </div>

          <div className="p-3 rounded-2xl bg-violet-50 border border-violet-200 text-center">
            <span className="text-xs font-black text-violet-800 block">Grade A</span>
            <span className="text-sm font-black text-violet-900 mt-1 block">80% – 89%</span>
            <span className="text-[10px] font-bold text-violet-700">First Class</span>
          </div>

          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-center">
            <span className="text-xs font-black text-sky-800 block">Grade B</span>
            <span className="text-sm font-black text-sky-900 mt-1 block">70% – 79%</span>
            <span className="text-[10px] font-bold text-sky-700">Second Class</span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-xs font-black text-amber-800 block">Grade C & D</span>
            <span className="text-sm font-black text-amber-900 mt-1 block">50% – 69%</span>
            <span className="text-[10px] font-bold text-amber-700">Pass</span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-center col-span-2 sm:col-span-1">
            <span className="text-xs font-black text-rose-800 block">Grade F</span>
            <span className="text-sm font-black text-rose-900 mt-1 block">&lt; 50%</span>
            <span className="text-[10px] font-bold text-rose-700">Needs Help</span>
          </div>
        </div>
      </div>

      {/* Admin Profile Details */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Administrator Credentials</h2>
            <p className="text-xs text-slate-400">Controller of examinations profile and contact</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Admin Name
            </label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Admin Official Email
            </label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Changes Saved' : 'Save Admin Settings'}</span>
          </button>
        </div>
      </form>

      {/* Database Backup & Reset Seed Records */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Database & Records Management</h2>
            <p className="text-xs text-slate-400">Backup student scores or restore initial demonstration data</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-800">Export Student Backup (JSON)</p>
            <p className="text-[11px] text-slate-500">
              Download complete student roster including all subject marks and calculated percentages.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Backup</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-rose-900">Restore HADI HADI Demo Data</p>
            <p className="text-[11px] text-rose-700">
              Reset database to initial student cohort with varied grades, distinction scorers, and subjects.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset database to original HADI HADI demonstration records?')) {
                resetToDefaultData();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
