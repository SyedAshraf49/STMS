
import React, { useState, Suspense } from 'react';
import { lazy } from 'react';
import AdminSidebar from './AdminSidebar';
import Header from '../layout/Header';
import FeedbackModal from '../FeedbackModal';

const AdminDashboard = lazy(() => import('../../pages/dashboard/AdminDashboard'));
const StudentsPage = lazy(() => import('../../pages/StudentsPage'));
const ReportsPage = lazy(() => import('../../pages/ReportsPage'));
const LeavePage = lazy(() => import('../../pages/LeavePage'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const renderPage = () => {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        {(() => {
          switch (currentPage) {
            case 'Dashboard':
              return <AdminDashboard />;
            case 'Students':
              return <StudentsPage />;
            case 'Reports':
              return <ReportsPage />;
            case 'Leave':
              return <LeavePage />;
            default:
              return <AdminDashboard />;
          }
        })()}
      </Suspense>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        openFeedbackModal={() => setIsFeedbackModalOpen(true)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800 p-4 sm:p-6">
          {renderPage()}
        </main>
      </div>
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
    </div>
  );
};

export default AdminLayout;