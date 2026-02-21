import React, { useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { CLASSES, SUBJECTS } from '../constants';
import { decodeAttendanceCode } from '../utils/attendanceCode';

const AttendanceCodePage: React.FC<{ onScanSuccess: () => void }> = ({ onScanSuccess }) => {
    const { t } = useI18n();
    const [attendanceCode, setAttendanceCode] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);

    const handleVerifyCode = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(t('attendanceCodePage.verifying'));

        const decoded = decodeAttendanceCode(attendanceCode, SUBJECTS);
        if (!decoded || !CLASSES.includes(decoded.className)) {
            setMessage(t('attendanceCodePage.invalidCode'));
            setIsError(true);
            return;
        }

        const today = new Date().toISOString().slice(0, 10);
        if (decoded.date !== today) {
            setMessage(t('attendanceCodePage.expiredCode'));
            setIsError(true);
            return;
        }

        setMessage(t('attendanceCodePage.success', decoded.subject, decoded.className));
        setIsError(false);
        window.setTimeout(onScanSuccess, 1500);
    };

    const handleCodeReset = () => {
        setAttendanceCode('');
        setMessage(null);
        setIsError(false);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('attendanceCodePage.pageTitle')}</h1>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md max-w-lg mx-auto">
                <form onSubmit={handleVerifyCode} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('attendanceCodePage.codeLabel')}</label>
                        <input
                            type="text"
                            value={attendanceCode}
                            onChange={(e) => setAttendanceCode(e.target.value)}
                            placeholder={t('attendanceCodePage.codePlaceholder')}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{t('attendanceCodePage.verifyButton')}</button>
                        <button type="button" onClick={handleCodeReset} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">{t('attendanceCodePage.resetButton')}</button>
                    </div>
                </form>
                {message && (
                  <p className={`mt-4 text-center font-semibold ${isError ? 'text-red-500' : 'text-green-500'}`}>
                    {message}
                  </p>
                )}
            </div>
        </div>
    );
};

export default AttendanceCodePage;
