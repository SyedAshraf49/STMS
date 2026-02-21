import React, { useState, useEffect, Suspense } from 'react';
import { lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
const LoginPage = lazy(() => import('./pages/LoginPage'));
import { UserRole } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider, useI18n } from './context/I18nContext';
import Toast from './components/Toast';

const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const TeacherLayout = lazy(() => import('./components/teacher/TeacherLayout'));
const StudentLayout = lazy(() => import('./components/student/StudentLayout'));
const ParentLayout = lazy(() => import('./components/parent/ParentLayout'));

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (user) {
      setShowWelcome(true);
    }
  }, [user]);

  if (!user) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <LoginPage />
      </Suspense>
    );
  }

  const renderLayout = () => {
    switch (user.role) {
      case UserRole.ADMIN:
        return <AdminLayout />;
      case UserRole.TEACHER:
        return <TeacherLayout />;
      case UserRole.STUDENT:
        return <StudentLayout />;
      case UserRole.PARENT:
        return <ParentLayout />;
      default:
        // Fallback to login page if role is unrecognized
        return <LoginPage />;
    }
  };

  return (
    <>
      <Toast 
        message={t('common.welcomeMessage', user.name)} 
        isVisible={showWelcome} 
        onClose={() => setShowWelcome(false)} 
      />
      <Suspense fallback={<LoadingScreen />}>
        {renderLayout()}
      </Suspense>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <I18nProvider>
          <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <AppContent />
          </div>
        </I18nProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;