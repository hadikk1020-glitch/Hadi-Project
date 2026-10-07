import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StudentProvider, useStudents } from './context/StudentContext';
import { Sidebar, NavTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './pages/DashboardView';
import { StudentsListView } from './pages/StudentsListView';
import { PerformanceAnalyticsView } from './pages/PerformanceAnalyticsView';
import { ReportsView } from './pages/ReportsView';
import { SettingsView } from './pages/SettingsView';
import { StudentModal } from './components/StudentModal';
import { StudentDetailsModal } from './components/StudentDetailsModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { LoginModal } from './components/LoginModal';
import { ToastContainer } from './components/ToastContainer';
import { Student } from './types/student';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    selectedStudentForDetail,
    setSelectedStudentForDetail,
    isAddModalOpen,
    setIsAddModalOpen,
    studentToEdit,
    setStudentToEdit,
    studentToDelete,
    setStudentToDelete
  } = useStudents();

  const handleViewStudent = (student: Student) => {
    setSelectedStudentForDetail(student);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area (Offset by lg:ml-72 for fixed sidebar) */}
      <div className="lg:ml-72 flex-1 flex flex-col min-h-screen">
        <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigateTab={(tab) => setActiveTab(tab)}
              onViewStudent={handleViewStudent}
            />
          )}

          {activeTab === 'students' && (
            <StudentsListView onViewStudent={handleViewStudent} />
          )}

          {activeTab === 'performance' && (
            <PerformanceAnalyticsView onViewStudent={handleViewStudent} />
          )}

          {activeTab === 'reports' && (
            <ReportsView onViewStudent={handleViewStudent} />
          )}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isAddModalOpen || !!studentToEdit}
        onClose={() => {
          setIsAddModalOpen(false);
          setStudentToEdit(null);
        }}
        studentToEdit={studentToEdit}
      />

      {/* Dedicated Student Details Modal */}
      {selectedStudentForDetail && (
        <StudentDetailsModal
          student={selectedStudentForDetail}
          onClose={() => setSelectedStudentForDetail(null)}
        />
      )}

      {/* Safe Delete Confirmation Modal */}
      <ConfirmDeleteModal
        student={studentToDelete}
        onClose={() => setStudentToDelete(null)}
      />

      {/* Admin Login Modal */}
      <LoginModal />

      {/* Real-time Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StudentProvider>
        <MainLayout />
      </StudentProvider>
    </AuthProvider>
  );
}
