import React from 'react';
import { MOCK_STUDENTS, MOCK_ATTENDANCE, MOCK_LEAVE_REQUESTS, MOCK_ANNOUNCEMENTS } from '../../data/mockData';
import { AttendanceStatus, LeaveStatus } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';

const DashboardCard: React.FC<{ title: string; value: string | number; description: string; }> = ({ title, value, description }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
);

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

const AdminDashboard: React.FC = () => {
    const { t } = useI18n();
    const { user } = useAuth();
    const totalStudents = MOCK_STUDENTS.length;
    const today = new Date().toISOString().slice(0, 10);
    const todayAttendance = MOCK_ATTENDANCE.filter(a => a.date === today && a.status !== AttendanceStatus.LEAVE);
    const presentToday = todayAttendance.filter(
        a =>
            a.status === AttendanceStatus.PRESENT ||
            a.status === AttendanceStatus.LATE ||
            a.status === AttendanceStatus.LATE_PRESENT
    ).length;
    const attendancePercentage = todayAttendance.length > 0 ? ((presentToday / todayAttendance.length) * 100).toFixed(1) : '0';
    const pendingLeaves = MOCK_LEAVE_REQUESTS.filter(l => l.status === LeaveStatus.PENDING).length;

    const attendanceData = MOCK_ATTENDANCE.reduce((acc, record) => {
        const student = MOCK_STUDENTS.find(s => s.id === record.studentId);
        if (student) {
            if (!acc[student.class]) {
                acc[student.class] = { name: student.class, present: 0, absent: 0, total: 0 };
            }
            if (record.status === AttendanceStatus.LEAVE) {
                return acc;
            }
            acc[student.class].total++;
            if (
                record.status === AttendanceStatus.PRESENT ||
                record.status === AttendanceStatus.LATE ||
                record.status === AttendanceStatus.LATE_PRESENT
            ) {
                acc[student.class].present++;
            } else {
                acc[student.class].absent++;
            }
        }
        return acc;
    }, {} as { [key: string]: { name: string, present: number, absent: number, total: number } });

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('dashboard.admin.pageTitle')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 mt-1">{t('common.welcomeMessage', user?.name)}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard title={t('dashboard.admin.totalStudents')} value={totalStudents} description={t('dashboard.admin.totalStudentsDesc')} />
                <DashboardCard title={t('dashboard.admin.todayAttendance')} value={`${attendancePercentage}%`} description={t('dashboard.admin.todayAttendanceDesc', presentToday)} />
                <DashboardCard title={t('dashboard.admin.pendingLeaves')} value={pendingLeaves} description={t('dashboard.admin.pendingLeavesDesc')} />
            </div>
            <AnnouncementCard />
            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.admin.classWiseAttendance')}</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.values(attendanceData)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="present" stackId="a" fill="#4ade80" name={t('common.present')} />
                        <Bar dataKey="absent" stackId="a" fill="#f87171" name={t('common.absent')} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminDashboard;