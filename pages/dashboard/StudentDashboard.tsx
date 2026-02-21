import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ATTENDANCE, MOCK_LEAVE_REQUESTS, MOCK_ANNOUNCEMENTS } from '../../data/mockData';
import { AttendanceStatus, LeaveStatus } from '../../types';
import { AttendanceIcon } from '../../components/icons';
import { useI18n } from '../../context/I18nContext';

const AnnouncementCard: React.FC = () => {
    const { t } = useI18n();
    return (
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('common.announcements')}</h3>
            <ul className="space-y-4">
                {MOCK_ANNOUNCEMENTS.map(announcement => (
                    <li key={announcement.id} className="border-l-4 border-indigo-500 pl-4">
                        <h4 className="font-bold text-gray-800 dark:text-gray-200">{announcement.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{announcement.content}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{announcement.date} - {t('common.byAuthor', announcement.author)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const StudentDashboard: React.FC<{ setCurrentPage: (page: string) => void }> = ({ setCurrentPage }) => {
    const { user } = useAuth();
    const { t } = useI18n();
    if (!user) return null;

    const myAttendance = MOCK_ATTENDANCE.filter(a => a.studentId === user.id && a.status !== AttendanceStatus.LEAVE);
    const presentCount = myAttendance.filter(
        a =>
            a.status === AttendanceStatus.PRESENT ||
            a.status === AttendanceStatus.LATE ||
            a.status === AttendanceStatus.LATE_PRESENT
    ).length;
    const totalCount = myAttendance.length;
    const attendancePercentageValue = totalCount > 0 ? (presentCount / totalCount) * 100 : 100;
    const myLeaveRequests = MOCK_LEAVE_REQUESTS.filter(l => l.studentId === user.id);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('dashboard.student.pageTitle')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 mt-1">{t('common.welcomeMessage', user?.name)}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.student.myAttendance')}</h3>
                    <div className="mt-2 flex items-center justify-between">
                         <p className="text-3xl font-semibold text-gray-900 dark:text-white">{attendancePercentageValue.toFixed(1)}%</p>
                         <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.student.days', presentCount, totalCount)}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${attendancePercentageValue}%` }}></div>
                    </div>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.student.myLeaveRequests')}</h3>
                    <div className="mt-1">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            <span className="text-green-500">{t('dashboard.student.approved', myLeaveRequests.filter(l => l.status === LeaveStatus.APPROVED).length)}</span>
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            <span className="text-yellow-500">{t('dashboard.student.pending', myLeaveRequests.filter(l => l.status === LeaveStatus.PENDING).length)}</span>
                        </p>
                         <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            <span className="text-red-500">{t('dashboard.student.rejected', myLeaveRequests.filter(l => l.status === LeaveStatus.REJECTED).length)}</span>
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('dashboard.student.markAttendance')}</h3>
                    <button 
                        onClick={() => setCurrentPage('AttendanceCode')}
                        className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <AttendanceIcon className="h-5 w-5 mr-2"/>
                        {t('dashboard.student.enterCode')}
                    </button>
                 </div>
            </div>
            <AnnouncementCard />
             <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.student.upcomingEvents')}</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                    <li>{t('dashboard.student.events.event1')}</li>
                    <li>{t('dashboard.student.events.event2')}</li>
                </ul>
            </div>
        </div>
    );
};

export default StudentDashboard;