import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_STUDENTS, MOCK_ATTENDANCE, MOCK_LEAVE_REQUESTS, MOCK_ANNOUNCEMENTS } from '../../data/mockData';
import { AttendanceStatus, LeaveStatus } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useI18n } from '../../context/I18nContext';

const AnnouncementCard: React.FC = () => {
    const { t } = useI18n();
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
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

const ParentDashboard: React.FC = () => {
    const { user } = useAuth();
    const { t } = useI18n();
    if (!user) return null;

    // Find the student associated with this parent
    const child = MOCK_STUDENTS.find(s => s.parentId === user.id);
    if (!child) {
        return <p>{t('dashboard.parent.noStudent')}</p>;
    }

    const childAttendance = MOCK_ATTENDANCE.filter(a => a.studentId === child.id && a.status !== AttendanceStatus.LEAVE);
    const presentCount = childAttendance.filter(
        a =>
            a.status === AttendanceStatus.PRESENT ||
            a.status === AttendanceStatus.LATE ||
            a.status === AttendanceStatus.LATE_PRESENT
    ).length;
    const totalCount = childAttendance.length;
    const attendancePercentageValue = totalCount > 0 ? (presentCount / totalCount) * 100 : 100;

    const childLeaveRequests = MOCK_LEAVE_REQUESTS.filter(l => l.studentId === child.id);
    const pendingParentApproval = childLeaveRequests.filter(l => l.parentStatus === LeaveStatus.PENDING).length;

    // Mock weekly attendance trend data
    const trendData = [
      { name: 'Week 1', attendance: 90 },
      { name: 'Week 2', attendance: 85 },
      { name: 'Week 3', attendance: 88 },
      { name: 'Week 4', attendance: 74 },
    ];


    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('dashboard.parent.pageTitle')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 mt-1">{t('common.welcomeMessage', user?.name)}</p>
            
            {/* Student Profile Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.parent.studentProfile')}</h3>
                 <div className="flex items-center space-x-4">
                    {/* Mock student photo */}
                    <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-2xl text-gray-500 dark:text-gray-400">{child.name.charAt(0)}</span>
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-800 dark:text-white">{child.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.parent.rollNo', child.rollNumber)}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{child.department} - {child.class}</p>
                    </div>
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Attendance Summary */}
                 <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.parent.overallAttendance')}</h3>
                    <div className="mt-2 flex items-center justify-between">
                         <p className="text-3xl font-semibold text-gray-900 dark:text-white">{attendancePercentageValue.toFixed(1)}%</p>
                         <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.student.days', presentCount, totalCount)}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${attendancePercentageValue}%` }}></div>
                    </div>
                </div>

                {/* Leave Request Summary */}
                 <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.parent.leaveRequests')}</h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{pendingParentApproval}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('dashboard.parent.pendingApproval')}</p>
                </div>
                
                 {/* Contact Teacher Card */}
                 <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.parent.communicate')}</h3>
                     <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{t('dashboard.parent.contactTeacher')}</p>
                    <button className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">{t('dashboard.parent.sendMessage')}</button>
                </div>
            </div>
            
             {/* Performance Trend */}
            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.parent.attendanceTrend')}</h3>
                <ResponsiveContainer width="100%" height={250}>
                     <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} label={{ value: '%', position: 'insideLeft', angle: -90, dy: 10 }}/>
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="attendance" stroke="#4f46e5" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-8">
                <AnnouncementCard />
            </div>
        </div>
    );
};

export default ParentDashboard;