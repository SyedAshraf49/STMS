
import React from 'react';
import { DashboardIcon, AttendanceIcon, ReportsIcon, LeaveIcon, CloseIcon, TimetableIcon, FeedbackIcon } from '../icons';
import { useI18n } from '../../context/I18nContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  openFeedbackModal: () => void;
}

const TeacherSidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, currentPage, setCurrentPage, openFeedbackModal }) => {
  const { t } = useI18n();

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  const navItems = [
    { name: 'Dashboard', page: 'Dashboard', icon: DashboardIcon },
    { name: 'Attendance', page: 'Attendance', icon: AttendanceIcon },
    { name: 'Reports', page: 'Reports', icon: ReportsIcon },
    { name: 'Leave', page: 'Leave', icon: LeaveIcon },
    { name: 'Timetable', page: 'Timetable', icon: TimetableIcon },
  ];

  const NavLink: React.FC<{ name: string; page?: string; icon: React.ElementType; onClick?: () => void }> = ({ name, page, icon: Icon, onClick }) => {
    const isActive = page ? currentPage === page : false;
    return (
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); onClick ? onClick() : handleNavClick(page!); }}
        className={`flex items-center px-4 py-2.5 mt-2 rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-indigo-600 text-white'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <Icon className="h-6 w-6" />
        <span className="mx-4 font-medium">{name}</span>
      </a>
    );
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 z-30 shadow-lg lg:shadow-none flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{t('sidebar.teacherApp')}</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-600 dark:text-gray-300">
            <CloseIcon className="w-6 h-6"/>
          </button>
        </div>
        <nav className="p-4 flex-grow">
          {navItems.map(item => <NavLink key={item.page} name={t(`common.${item.name.toLowerCase()}`)} page={item.page} icon={item.icon} />)}
        </nav>
        <div className="p-4 border-t dark:border-gray-700">
            <NavLink name={t('common.feedback')} icon={FeedbackIcon} onClick={openFeedbackModal} />
        </div>
      </div>
    </>
  );
};

export default TeacherSidebar;