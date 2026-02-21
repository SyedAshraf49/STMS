import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, LeaveRequest, LeaveStatus } from '../types';
import { CLASS_INCHARGE_TEACHER_ID, MOCK_LEAVE_REQUESTS, MOCK_STUDENTS } from '../data/mockData';
import { useI18n } from '../context/I18nContext';

const getStatusColor = (status: LeaveStatus) => {
    switch (status) {
        case LeaveStatus.PENDING: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case LeaveStatus.APPROVED: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case LeaveStatus.REJECTED: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
};

const getStudentName = (studentId: string) => MOCK_STUDENTS.find(s => s.id === studentId)?.name || 'Unknown Student';

const LeaveRequestModal: React.FC<{ onClose: () => void, onSave: (request: Omit<LeaveRequest, 'id' | 'status' | 'studentId' | 'parentStatus'>) => void }> = ({ onClose, onSave }) => {
    const { t } = useI18n();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ startDate, endDate, reason });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{t('leavePage.modal.title')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('leavePage.modal.startDate')}</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    </div>
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('leavePage.modal.endDate')}</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    </div>
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('leavePage.modal.reason')}</label>
                        <textarea value={reason} onChange={e => setReason(e.target.value)} required rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    </div>
                     <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">{t('common.cancel')}</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{t('common.submit')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const StudentLeaveView: React.FC = () => {
    const { t } = useI18n();
    const { user } = useAuth();
    const studentId = user?.id || '';
    const [myRequests, setMyRequests] = useState(MOCK_LEAVE_REQUESTS.filter(r => r.studentId === studentId));
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveRequest = (requestData: Omit<LeaveRequest, 'id' | 'status' | 'studentId' | 'parentStatus'>) => {
        const newRequest: LeaveRequest = {
            ...requestData,
            id: `l${MOCK_LEAVE_REQUESTS.length + 1}`,
            studentId,
            status: LeaveStatus.PENDING,
            parentStatus: LeaveStatus.PENDING,
        };
        setMyRequests(prev => [...prev, newRequest]);
        MOCK_LEAVE_REQUESTS.push(newRequest);
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('leavePage.myRequests')}</h2>
                <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{t('leavePage.requestLeave')}</button>
            </div>
            <ul className="space-y-4">
                {myRequests.map(req => (
                    <li key={req.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center flex-wrap">
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{t('leavePage.dates', req.startDate, req.endDate)}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('leavePage.reason', req.reason)}</p>
                        </div>
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(req.parentStatus)}`}>{t('leavePage.parentStatus', t(`common.status.${req.parentStatus}`))}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(req.status)}`}>{t('leavePage.classInchargeStatus', t(`common.status.${req.status}`))}</span>
                        </div>
                    </li>
                ))}
            </ul>
            {isModalOpen && <LeaveRequestModal onClose={() => setIsModalOpen(false)} onSave={handleSaveRequest} />}
        </div>
    );
};

const ClassInchargeLeaveView: React.FC = () => {
    const { t } = useI18n();
    const [requests, setRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);

    const handleStatusChange = (requestId: string, status: LeaveStatus) => {
        setRequests(requests.map(r => r.id === requestId ? { ...r, status } : r));
        const reqIndex = MOCK_LEAVE_REQUESTS.findIndex(r => r.id === requestId);
        if (reqIndex > -1) {
            MOCK_LEAVE_REQUESTS[reqIndex].status = status;
        }
    };

    return (
         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">{t('leavePage.admin.student')}</th>
                        <th scope="col" className="px-6 py-3">{t('leavePage.admin.dates')}</th>
                        <th scope="col" className="px-6 py-3">{t('leavePage.admin.reason')}</th>
                        <th scope="col" className="px-6 py-3">{t('leavePage.admin.parentStatus')}</th>
                        <th scope="col" className="px-6 py-3">{t('leavePage.admin.classInchargeStatus')}</th>
                        <th scope="col" className="px-6 py-3">{t('common.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                        <tr key={req.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{getStudentName(req.studentId)}</td>
                            <td className="px-6 py-4">{req.startDate} to {req.endDate}</td>
                            <td className="px-6 py-4">{req.reason}</td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(req.parentStatus)}`}>{t(`common.status.${req.parentStatus}`)}</span></td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(req.status)}`}>{t(`common.status.${req.status}`)}</span></td>
                            <td className="px-6 py-4">
                                {req.status === LeaveStatus.PENDING && req.parentStatus === LeaveStatus.APPROVED && (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleStatusChange(req.id, LeaveStatus.APPROVED)} className="font-medium text-green-600 dark:text-green-500 hover:underline">{t('common.approved')}</button>
                                        <button onClick={() => handleStatusChange(req.id, LeaveStatus.REJECTED)} className="font-medium text-red-600 dark:text-red-500 hover:underline">{t('common.rejected')}</button>
                                    </div>
                                )}
                                {req.parentStatus !== LeaveStatus.APPROVED && <span className="text-xs text-gray-500">{t('leavePage.awaitingParent')}</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const ParentLeaveView: React.FC = () => {
    const { t } = useI18n();
    const { user } = useAuth();
    const child = MOCK_STUDENTS.find(s => s.parentId === user?.id);
    const [requests, setRequests] = useState<LeaveRequest[]>(child ? MOCK_LEAVE_REQUESTS.filter(r => r.studentId === child.id) : []);

    const handleParentStatusChange = (requestId: string, status: LeaveStatus) => {
        setRequests(requests.map(r => {
            if (r.id !== requestId) return r;
            if (status === LeaveStatus.REJECTED) {
                return { ...r, parentStatus: status, status: LeaveStatus.REJECTED };
            }
            return { ...r, parentStatus: status };
        }));
        // Also update the global mock data for this session
        const reqIndex = MOCK_LEAVE_REQUESTS.findIndex(r => r.id === requestId);
        if (reqIndex > -1) {
            MOCK_LEAVE_REQUESTS[reqIndex].parentStatus = status;
            if (status === LeaveStatus.REJECTED) {
                MOCK_LEAVE_REQUESTS[reqIndex].status = LeaveStatus.REJECTED;
            }
        }
    };

    if (!child) return <p>{t('leavePage.parent.noStudent')}</p>;

    return (
         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">{t('leavePage.parent.dates')}</th>
                        <th scope="col" className="px-6 py-3">{t('leavePage.parent.reason')}</th>
                        <th scope="col" className="px-6 py-3">{t('leavePage.parent.yourStatus')}</th>
                        <th scope="col" className="px-6 py-3">{t('leavePage.parent.schoolStatus')}</th>
                        <th scope="col" className="px-6 py-3">{t('common.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                        <tr key={req.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4">{req.startDate} to {req.endDate}</td>
                            <td className="px-6 py-4">{req.reason}</td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(req.parentStatus)}`}>{t(`common.status.${req.parentStatus}`)}</span></td>
                             <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(req.status)}`}>{t(`common.status.${req.status}`)}</span></td>
                            <td className="px-6 py-4">
                                {req.parentStatus === LeaveStatus.PENDING && (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleParentStatusChange(req.id, LeaveStatus.APPROVED)} className="font-medium text-green-600 dark:text-green-500 hover:underline">{t('common.approved')}</button>
                                        <button onClick={() => handleParentStatusChange(req.id, LeaveStatus.REJECTED)} className="font-medium text-red-600 dark:text-red-500 hover:underline">{t('common.rejected')}</button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const LeavePage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useI18n();

    const renderView = () => {
        switch (user?.role) {
            case UserRole.STUDENT:
                return <StudentLeaveView />;
            case UserRole.PARENT:
                return <ParentLeaveView />;
            case UserRole.TEACHER:
                if (user.id !== CLASS_INCHARGE_TEACHER_ID) {
                    return <p className="text-gray-600 dark:text-gray-300">{t('leavePage.onlyClassIncharge')}</p>;
                }
                return <ClassInchargeLeaveView />;
            case UserRole.ADMIN:
                return <p className="text-gray-600 dark:text-gray-300">{t('leavePage.onlyClassIncharge')}</p>;
            default:
                return null;
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('leavePage.pageTitle')}</h1>
            {renderView()}
        </div>
    );
};

export default LeavePage;