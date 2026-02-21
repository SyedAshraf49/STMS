import React, { useState, useMemo } from 'react';
import { MOCK_ATTENDANCE, MOCK_STUDENTS } from '../data/mockData';
import { AttendanceStatus, UserRole } from '../types';
import { CLASSES } from '../constants';
import { 
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';

type ViewMode = 'summary' | 'trend';
type ChartType = 'pie' | 'bar' | 'line';

const ReportsPage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useI18n();
    const [filterClass, setFilterClass] = useState<string>('all');
    const [filterStudent, setFilterStudent] = useState<string>('all');
    
    // Visualization State
    const [viewMode, setViewMode] = useState<ViewMode>('summary');
    const [chartType, setChartType] = useState<ChartType>('pie');

    const studentsInClass = useMemo(() => {
        if (filterClass === 'all') return MOCK_STUDENTS;
        return MOCK_STUDENTS.filter(s => s.class === filterClass);
    }, [filterClass]);

    const getStudentName = (studentId: string) => MOCK_STUDENTS.find(s => s.id === studentId)?.name || 'Unknown';

    const isParentOrStudent = user?.role === UserRole.STUDENT || user?.role === UserRole.PARENT;

    const filteredAttendance = useMemo(() => {
        if (user?.role === UserRole.STUDENT) {
            return MOCK_ATTENDANCE.filter(a => a.studentId === user.id);
        }
        if (user?.role === UserRole.PARENT) {
            const child = MOCK_STUDENTS.find(s => s.parentId === user.id);
            return child ? MOCK_ATTENDANCE.filter(a => a.studentId === child.id) : [];
        }

        let data = MOCK_ATTENDANCE;
        if (filterClass !== 'all') {
            const studentIds = MOCK_STUDENTS.filter(s => s.class === filterClass).map(s => s.id);
            data = data.filter(a => studentIds.includes(a.studentId));
        }
        if (filterStudent !== 'all') {
            data = data.filter(a => a.studentId === filterStudent);
        }
        return data;
    }, [filterClass, filterStudent, user]);

    const reportAttendance = useMemo(
        () => filteredAttendance.filter(record => record.status !== AttendanceStatus.LEAVE),
        [filteredAttendance]
    );
    
    // Data for Summary View (Aggregated totals)
    const summaryData = useMemo(() => {
        const summary = {
            present: 0,
            absent: 0,
            late: 0,
        };
        reportAttendance.forEach(record => {
            if (record.status === AttendanceStatus.ABSENT) {
                summary.absent += 1;
            }
            if (record.status === AttendanceStatus.PRESENT || record.status === AttendanceStatus.LATE_PRESENT) {
                summary.present += 1;
            }
            if (record.status === AttendanceStatus.LATE || record.status === AttendanceStatus.LATE_PRESENT) {
                summary.late += 1;
            }
        });
        
        return [
            { name: t('common.status.Present'), value: summary.present, fill: '#4ade80' },
            { name: t('common.status.Absent'), value: summary.absent, fill: '#f87171' },
            { name: t('common.status.Late'), value: summary.late, fill: '#facc15' },
        ];
    }, [reportAttendance, t]);

    // Data for Trend View (Grouped by Date)
    const trendData = useMemo(() => {
        const groups: Record<string, any> = {};
        
        // Initialize groups for all dates present in data
        reportAttendance.forEach(r => {
            if (!groups[r.date]) {
                groups[r.date] = { 
                    name: r.date, 
                    [t('common.status.Present')]: 0, 
                    [t('common.status.Absent')]: 0, 
                    [t('common.status.Late')]: 0
                };
            }
            if (r.status === AttendanceStatus.ABSENT) {
                groups[r.date][t('common.status.Absent')]++;
            }
            if (r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LATE_PRESENT) {
                groups[r.date][t('common.status.Present')]++;
            }
            if (r.status === AttendanceStatus.LATE || r.status === AttendanceStatus.LATE_PRESENT) {
                groups[r.date][t('common.status.Late')]++;
            }
        });

        return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
    }, [reportAttendance, t]);
    
    const handleExport = () => {
        const headers = isParentOrStudent 
            ? ['Date', 'Subject', 'Status'] 
            : ['Student Name', 'Date', 'Subject', 'Status'];

        const rows = reportAttendance.map(record => {
            const rowData = isParentOrStudent 
                ? [record.date, record.subject, t(`common.status.${record.status}`)]
                : [getStudentName(record.studentId), record.date, record.subject, t(`common.status.${record.status}`)];
            return rowData.map(value => `"${value.replace(/"/g, '""')}"`).join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "attendance-report.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const pageTitle = isParentOrStudent 
        ? (user?.role === UserRole.STUDENT ? t('reportsPage.myReportTitle') : t('reportsPage.myChildReportTitle')) 
        : t('reportsPage.pageTitle');

    // Helper to render the correct chart based on state
    const renderChart = () => {
        if (viewMode === 'summary') {
            if (chartType === 'bar') {
                return (
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={summaryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" name="Count">
                                {summaryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                );
            }
            // Default to Pie for summary
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={summaryData} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value">
                            {summaryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            );
        } else {
            // Trend View
            if (chartType === 'line') {
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey={t('common.status.Present')} stroke="#4ade80" strokeWidth={2} />
                            <Line type="monotone" dataKey={t('common.status.Absent')} stroke="#f87171" strokeWidth={2} />
                            <Line type="monotone" dataKey={t('common.status.Late')} stroke="#facc15" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                );
            }
            // Default to Bar (Stacked) for Trend
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey={t('common.status.Present')} stackId="a" fill="#4ade80" />
                        <Bar dataKey={t('common.status.Absent')} stackId="a" fill="#f87171" />
                        <Bar dataKey={t('common.status.Late')} stackId="a" fill="#facc15" />
                    </BarChart>
                </ResponsiveContainer>
            );
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                {pageTitle}
            </h1>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-center justify-between">
                {!isParentOrStudent ? (
                    <div className="flex flex-wrap gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('reportsPage.filterByClass')}</label>
                            <select value={filterClass} onChange={e => { setFilterClass(e.target.value); setFilterStudent('all'); }} className="mt-1 block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="all">{t('reportsPage.allClasses')}</option>
                                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('reportsPage.filterByStudent')}</label>
                            <select value={filterStudent} onChange={e => setFilterStudent(e.target.value)} className="mt-1 block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="all">{t('reportsPage.allStudents')}</option>
                                {studentsInClass.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>
                ) : <div /> /* Empty div for spacing */}
                <button onClick={handleExport} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 h-fit">{t('reportsPage.downloadCSV')}</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                     <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('reportsPage.summary')}</h3>
                        
                        {/* Visualization Controls */}
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400 block mb-1">{t('reportsPage.viewMode')}</label>
                                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                    <button 
                                        onClick={() => { setViewMode('summary'); setChartType('pie'); }}
                                        className={`flex-1 py-1 px-3 text-xs font-medium rounded-md transition-colors ${viewMode === 'summary' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
                                    >
                                        {t('reportsPage.viewSummary')}
                                    </button>
                                    <button 
                                        onClick={() => { setViewMode('trend'); setChartType('bar'); }}
                                        className={`flex-1 py-1 px-3 text-xs font-medium rounded-md transition-colors ${viewMode === 'trend' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
                                    >
                                        {t('reportsPage.viewTrend')}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400 block mb-1">{t('reportsPage.chartType')}</label>
                                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                    {viewMode === 'summary' ? (
                                        <>
                                            <button onClick={() => setChartType('pie')} className={`flex-1 py-1 px-2 text-xs font-medium rounded-md transition-colors ${chartType === 'pie' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}>{t('reportsPage.chartPie')}</button>
                                            <button onClick={() => setChartType('bar')} className={`flex-1 py-1 px-2 text-xs font-medium rounded-md transition-colors ${chartType === 'bar' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}>{t('reportsPage.chartBar')}</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setChartType('bar')} className={`flex-1 py-1 px-2 text-xs font-medium rounded-md transition-colors ${chartType === 'bar' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}>{t('reportsPage.chartBar')}</button>
                                            <button onClick={() => setChartType('line')} className={`flex-1 py-1 px-2 text-xs font-medium rounded-md transition-colors ${chartType === 'line' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}>{t('reportsPage.chartLine')}</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                     </div>
                    
                    {renderChart()}
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('reportsPage.detailedRecords')}</h3>
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {!isParentOrStudent && <th scope="col" className="px-6 py-3">{t('common.students')}</th>}
                                <th scope="col" className="px-6 py-3">{t('attendancePage.date')}</th>
                                <th scope="col" className="px-6 py-3">{t('attendancePage.subjectPeriod')}</th>
                                <th scope="col" className="px-6 py-3">{t('common.statusTitle')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportAttendance.map(record => (
                                <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    {!isParentOrStudent && <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{getStudentName(record.studentId)}</td>}
                                    <td className="px-6 py-4">{record.date}</td>
                                    <td className="px-6 py-4">{record.subject}</td>
                                    <td className="px-6 py-4">{t(`common.status.${record.status}`)}</td>
                                </tr>
                            ))}
                             {reportAttendance.length === 0 && (
                                <tr>
                                    <td colSpan={isParentOrStudent ? 3 : 4} className="text-center py-4">{t('reportsPage.noRecords')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;