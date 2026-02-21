import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_TIMETABLE, MOCK_STUDENTS } from '../data/mockData';
import { UserRole } from '../types';
import { useI18n } from '../context/I18nContext';

const TimetablePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  
  const timetableData = MOCK_TIMETABLE.filter(entry => {
    if (user?.role === UserRole.TEACHER) {
      return entry.teacherId === user.id;
    }
    if (user?.role === UserRole.STUDENT) {
      // Find the mock student's class
      const student = MOCK_STUDENTS.find(s => s.id === user.id);
      return student && entry.class === student.class;
    }
    return false;
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [...new Set(MOCK_TIMETABLE.map(t => t.time))].sort();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('timetablePage.pageTitle')}</h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 border border-gray-200 dark:border-gray-600">{t('timetablePage.time')}</th>
              {days.map(day => (
                <th key={day} className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 border border-gray-200 dark:border-gray-600 text-center">{t(`timetablePage.days.${day}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {timeSlots.map(time => (
              <tr key={time}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">{time}</td>
                {days.map(day => {
                  const entry = timetableData.find(e => e.day === day && e.time === time);
                  return (
                    <td key={day} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 text-center">
                      {entry ? (
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
                          <p className="font-bold">{entry.subject}</p>
                          {user?.role === UserRole.STUDENT && <p className="text-xs">{t('timetablePage.teacherId', entry.teacherId)}</p>}
                          {user?.role === UserRole.TEACHER && <p className="text-xs">{t('timetablePage.class', entry.class)}</p>}
                        </div>
                      ) : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimetablePage;