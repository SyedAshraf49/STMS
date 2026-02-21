import React from 'react';
import { MOCK_STUDENTS, MOCK_LEAVE_REQUESTS, MOCK_ANNOUNCEMENTS } from '../../data/mockData';
import { LeaveStatus } from '../../types';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';

const DashboardCard: React.FC<{ title: string; value: string | number; description: string; icon?: string; }> = ({ title, value, description, icon }) => (
    <div className="card p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover-lift animate-scale-in">
        <div className="flex items-start justify-between mb-4">
            <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider letter-spacing">{title}</h3>
            </div>
            {icon && <span className="text-3xl">{icon}</span>}
        </div>
        <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">{value}</p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);

const AnnouncementCard: React.FC = () => {
    const { t } = useI18n();
    return (
        <div className="mt-8 card p-6 border border-gray-200 dark:border-gray-700 animate-slide-in-up">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                📢 {t('common.announcements')}
            </h3>
            <ul className="space-y-4">
                {MOCK_ANNOUNCEMENTS.map((announcement, i) => (
                    <li key={announcement.id} className="border-l-4 border-indigo-500 pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded transition-colors duration-200 animate-slide-in-left hover-lift" style={{animationDelay: `${i * 0.1}s`}}>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">{announcement.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{announcement.content}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{announcement.date} - {t('common.byAuthor', announcement.author)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const TeacherDashboard: React.FC = () => {
    const { t } = useI18n();
    const { user } = useAuth();
    // Assuming teacher1 teaches CS101 and CS102
    const myClasses = ['CS101', 'CS102'];
    const myStudents = MOCK_STUDENTS.filter(s => myClasses.includes(s.class));
    const pendingLeaves = MOCK_LEAVE_REQUESTS.filter(l => myStudents.some(s => s.id === l.studentId) && l.status === LeaveStatus.PENDING).length;
    
    return (
        <div>
            <div className="mb-8 animate-fade-in">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white animate-slide-in-up">{t('dashboard.teacher.pageTitle')}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg animate-slide-in-up stagger-1">{t('common.welcomeMessage', user?.name)}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="stagger-0" style={{animationDelay: '0s'}}>
                    <DashboardCard 
                        title={t('dashboard.teacher.myClasses')} 
                        value={myClasses.length} 
                        description={myClasses.join(', ')}
                        icon="📚"
                    />
                </div>
                <div className="stagger-1" style={{animationDelay: '0.1s'}}>
                    <DashboardCard 
                        title={t('dashboard.teacher.myStudents')} 
                        value={myStudents.length} 
                        description={t('dashboard.teacher.myStudentsDesc')}
                        icon="👨‍🎓"
                    />
                </div>
                <div className="stagger-2" style={{animationDelay: '0.2s'}}>
                    <DashboardCard 
                        title={t('dashboard.teacher.pendingLeaves')} 
                        value={pendingLeaves} 
                        description={t('dashboard.teacher.pendingLeavesDesc')}
                        icon="📋"
                    />
                </div>
            </div>
            
            <AnnouncementCard />
            
            <div className="mt-8 card p-6 border border-gray-200 dark:border-gray-700 animate-slide-in-up hover-lift">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    📅 {t('dashboard.teacher.upcomingEvents')}
                </h3>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3 p-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors animate-slide-in-left hover-lift">
                        <span className="text-xl mt-1">🎯</span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{t('dashboard.teacher.events.event1')}</span>
                    </li>
                    <li className="flex items-start gap-3 p-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors animate-slide-in-left hover-lift" style={{animationDelay: '0.1s'}}>
                        <span className="text-xl mt-1">🏆</span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{t('dashboard.teacher.events.event2')}</span>
                    </li>
                    <li className="flex items-start gap-3 p-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors animate-slide-in-left hover-lift" style={{animationDelay: '0.2s'}}>
                        <span className="text-xl mt-1">🌟</span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{t('dashboard.teacher.events.event3')}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default TeacherDashboard;