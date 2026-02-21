import React, { useState, useEffect } from 'react';
import { MOCK_STUDENTS, MOCK_ATTENDANCE } from '../data/mockData';
import { Student, AttendanceStatus } from '../types';
import { CLASSES, SUBJECTS } from '../constants';
import { AttendanceIcon } from '../components/icons';
import Toast from '../components/Toast';
import { useI18n } from '../context/I18nContext';
import { generateAttendanceCode } from '../utils/attendanceCode';

const AttendanceCodeModal: React.FC<{ code: string; onClose: () => void }> = ({ code, onClose }) => {
    const { t } = useI18n();
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-sm text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{t('attendancePage.codeModal.title')}</h2>
                <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">{t('attendancePage.codeModal.label')}</p>
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 break-all">{code}</p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">{t('attendancePage.codeModal.description')}</p>
                <button onClick={onClose} className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-full">{t('common.close')}</button>
            </div>
        </div>
    );
};

const AttendancePage: React.FC = () => {
    const { t } = useI18n();
    const [selectedClass, setSelectedClass] = useState<string>(CLASSES[0]);
    const [selectedSubject, setSelectedSubject] = useState<string>(SUBJECTS[0]);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
    const [students, setStudents] = useState<Student[]>([]);
    const [attendance, setAttendance] = useState<{ [key: string]: AttendanceStatus }>({});
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const [showSubmitToast, setShowSubmitToast] = useState(false);

    const ATTENDANCE_MARKING_STATUSES: AttendanceStatus[] = [
        AttendanceStatus.PRESENT,
        AttendanceStatus.LATE,
        AttendanceStatus.ABSENT,
    ];

    useEffect(() => {
        const classStudents = MOCK_STUDENTS.filter(s => s.class === selectedClass);
        setStudents(classStudents);

        const newAttendance: { [key: string]: AttendanceStatus } = {};
        const existingRecords = MOCK_ATTENDANCE.filter(
            a =>
                a.date === selectedDate &&
                a.subject === selectedSubject &&
                MOCK_STUDENTS.some(s => s.id === a.studentId && s.class === selectedClass)
        );
        
        classStudents.forEach(student => {
            const record = existingRecords.find(r => r.studentId === student.id);
            newAttendance[student.id] =
                record?.status === AttendanceStatus.LEAVE
                    ? AttendanceStatus.ABSENT
                    : (record?.status ?? AttendanceStatus.PRESENT);
        });
        setAttendance(newAttendance);
    }, [selectedClass, selectedDate, selectedSubject]);

    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        setAttendance(prev => {
            const currentStatus = prev[studentId] ?? AttendanceStatus.PRESENT;

            if (status === AttendanceStatus.ABSENT) {
                return { ...prev, [studentId]: AttendanceStatus.ABSENT };
            }

            if (status === AttendanceStatus.PRESENT) {
                if (currentStatus === AttendanceStatus.LATE) {
                    return { ...prev, [studentId]: AttendanceStatus.LATE_PRESENT };
                }
                if (currentStatus === AttendanceStatus.LATE_PRESENT) {
                    return { ...prev, [studentId]: AttendanceStatus.LATE };
                }
                return { ...prev, [studentId]: AttendanceStatus.PRESENT };
            }

            if (status === AttendanceStatus.LATE) {
                if (currentStatus === AttendanceStatus.PRESENT || currentStatus === AttendanceStatus.ABSENT) {
                    return { ...prev, [studentId]: AttendanceStatus.LATE_PRESENT };
                }
                if (currentStatus === AttendanceStatus.LATE_PRESENT) {
                    return { ...prev, [studentId]: AttendanceStatus.PRESENT };
                }
                return { ...prev, [studentId]: AttendanceStatus.LATE };
            }

            return { ...prev, [studentId]: status };
        });
    };

    const isStatusSelected = (currentStatus: AttendanceStatus | undefined, statusButton: AttendanceStatus) => {
        if (statusButton === AttendanceStatus.PRESENT) {
            return currentStatus === AttendanceStatus.PRESENT || currentStatus === AttendanceStatus.LATE_PRESENT;
        }
        if (statusButton === AttendanceStatus.LATE) {
            return currentStatus === AttendanceStatus.LATE || currentStatus === AttendanceStatus.LATE_PRESENT;
        }
        return currentStatus === statusButton;
    };

    const markAllPresent = () => {
        const newAttendance: { [key: string]: AttendanceStatus } = {};
        students.forEach(student => {
            newAttendance[student.id] = AttendanceStatus.PRESENT;
        });
        setAttendance(newAttendance);
    };

    const attendanceCode = generateAttendanceCode({
            date: selectedDate,
            className: selectedClass,
            subject: selectedSubject,
    });

    const attendanceSummary = students.reduce(
        (summary, student) => {
            const status = attendance[student.id];
            if (status === AttendanceStatus.PRESENT || status === AttendanceStatus.LATE_PRESENT) summary.present += 1;
            if (status === AttendanceStatus.LATE || status === AttendanceStatus.LATE_PRESENT) summary.late += 1;
            if (status === AttendanceStatus.ABSENT) summary.absent += 1;
            return summary;
        },
        { present: 0, late: 0, absent: 0 }
    );

    const handleSubmit = () => {
        setShowSubmitToast(true);
        // In a real app, you would save this data to your database
        console.log({
            date: selectedDate,
            class: selectedClass,
            subject: selectedSubject,
            records: attendance
        });
    };

    const getStatusColor = (status: AttendanceStatus) => {
        switch (status) {
            case AttendanceStatus.PRESENT: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case AttendanceStatus.ABSENT: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case AttendanceStatus.LATE: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case AttendanceStatus.LATE_PRESENT: return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('attendancePage.pageTitle')}</h1>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('attendancePage.date')}</label>
                    <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="mt-1 block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.class')}</label>
                    <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="mt-1 block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('attendancePage.subjectPeriod')}</label>
                    <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="mt-1 block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <button onClick={markAllPresent} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 h-fit">{t('attendancePage.markAllPresent')}</button>
                      <button onClick={() => setIsCodeModalOpen(true)} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 h-fit flex items-center">
                          <AttendanceIcon className="h-5 w-5 mr-2" />
                          {t('attendancePage.generateCode')}
                </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t('attendancePage.latePresentHint')}
            </p>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="mb-4 flex flex-wrap gap-2 text-sm">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        {t('common.status.Present')}: {attendanceSummary.present}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        {t('common.status.Late')}: {attendanceSummary.late}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        {t('common.status.Absent')}: {attendanceSummary.absent}
                    </span>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {students.map(student => (
                        <li key={student.id} className="py-4 flex flex-col sm:flex-row items-center justify-between">
                            <div className="mb-2 sm:mb-0">
                                <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{student.rollNumber}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                {ATTENDANCE_MARKING_STATUSES.map(status => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(student.id, status)}
                                        className={`px-3 py-1 text-sm font-medium rounded-full ${isStatusSelected(attendance[student.id], status) ? getStatusColor(status) : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-300'}`}
                                    >
                                        {t(`common.status.${status}`)}
                                    </button>
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-6 flex justify-end">
                <button onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{t('attendancePage.submit')}</button>
            </div>

            {isCodeModalOpen && <AttendanceCodeModal code={attendanceCode} onClose={() => setIsCodeModalOpen(false)} />}
            <Toast
                message={t('attendancePage.submitSuccess')}
                isVisible={showSubmitToast}
                onClose={() => setShowSubmitToast(false)}
            />
        </div>
    );
};

export default AttendancePage;