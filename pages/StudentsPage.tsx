import React, { useState } from 'react';
import { MOCK_STUDENTS } from '../data/mockData';
import { Student } from '../types';
import { DEPARTMENTS, CLASSES } from '../constants';
import { UploadIcon } from '../components/icons';
import { useI18n } from '../context/I18nContext';

const StudentModal: React.FC<{ student: Student | null; onClose: () => void; onSave: (student: Student) => void; }> = ({ student, onClose, onSave }) => {
    const { t } = useI18n();
    const [formData, setFormData] = useState<Student>(student || { id: '', name: '', rollNumber: '', class: CLASSES[0], department: DEPARTMENTS[0] });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{student ? t('studentsPage.edit') : t('studentsPage.add')}</h2>
                <form onSubmit={handleSubmit}>
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.name')}</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.rollNumber')}</label>
                        <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.department')}</label>
                        <select name="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.class')}</label>
                        <select name="class" value={formData.class} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">{t('common.cancel')}</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{t('common.save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const StudentImportModal: React.FC<{ onClose: () => void; onImport: (students: Student[]) => { newCount: number, duplicateCount: number }; }> = ({ onClose, onImport }) => {
    const { t } = useI18n();
    const [file, setFile] = useState<File | null>(null);
    const [feedback, setFeedback] = useState<{ success: number; duplicates: number, errors: string[] } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setFeedback(null);
        }
    };

    const processCSV = () => {
        if (!file) return;
        setIsProcessing(true);
        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target?.result as string;
            const rows = text.split('\n').filter(row => row.trim() !== '');
            const headerRow = rows.shift()?.trim().toLowerCase().split(',');
            const expectedHeader = ['name', 'rollnumber', 'class', 'department'];

            if (!headerRow || JSON.stringify(headerRow.map(h => h.replace(/\s/g, ''))) !== JSON.stringify(expectedHeader)) {
                setFeedback({ success: 0, duplicates: 0, errors: [t('studentsPage.importModal.invalidHeader', 'name,rollNumber,class,department', headerRow?.join(','))] });
                setIsProcessing(false);
                return;
            }

            const importedStudents: Student[] = [];
            const errors: string[] = [];

            rows.forEach((row, index) => {
                const values = row.trim().split(',');
                if (values.length !== 4) {
                    errors.push(t('studentsPage.importModal.wrongColumns', index + 2, 4, values.length));
                    return;
                }
                const [name, rollNumber, studentClass, department] = values.map(v => v.trim());

                if (!name || !rollNumber || !studentClass || !department) {
                    errors.push(t('studentsPage.importModal.emptyFields', index + 2));
                    return;
                }
                
                importedStudents.push({ id: '', name, rollNumber, class: studentClass, department });
            });

            if (errors.length === 0 && importedStudents.length > 0) {
                 const { newCount, duplicateCount } = onImport(importedStudents);
                 setFeedback({ success: newCount, duplicates: duplicateCount, errors: [] });
            } else {
                 setFeedback({ success: 0, duplicates: 0, errors });
            }

            setIsProcessing(false);
            setFile(null);
        };

        reader.onerror = () => {
            setFeedback({ success: 0, duplicates: 0, errors: [t('studentsPage.importModal.readFileError')] });
            setIsProcessing(false);
        };
        
        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{t('studentsPage.importModal.title')}</h2>
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('studentsPage.importModal.format')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('studentsPage.importModal.formatDesc', '`name,rollNumber,class,department`')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('studentsPage.importModal.example', '`John Doe,CS101-01,CS101,Computer Science`')}</p>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('studentsPage.importModal.uploadLabel')}</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                    <span>{file ? file.name : t('studentsPage.importModal.selectFile')}</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} />
                                </label>
                                {!file && <p className="pl-1">{t('studentsPage.importModal.dragDrop')}</p>}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500">{t('studentsPage.importModal.fileSize')}</p>
                        </div>
                    </div>
                </div>

                {feedback && (
                    <div className="mt-4 p-4 rounded-md bg-gray-50 dark:bg-gray-700">
                        <h3 className="text-md font-bold text-gray-900 dark:text-white">{t('studentsPage.importModal.resultsTitle')}</h3>
                        {feedback.success > 0 && <p className="text-green-600 dark:text-green-400">{t('studentsPage.importModal.success', feedback.success)}</p>}
                        {feedback.duplicates > 0 && <p className="text-yellow-600 dark:text-yellow-400">{t('studentsPage.importModal.duplicates', feedback.duplicates)}</p>}
                        {feedback.errors.length > 0 && (
                            <div>
                                <p className="text-red-600 dark:text-red-400">{t('studentsPage.importModal.errors', feedback.errors.length)}</p>
                                <ul className="list-disc list-inside text-sm text-red-500 dark:text-red-400 max-h-32 overflow-y-auto">
                                    {feedback.errors.map((error, i) => <li key={i}>{error}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end gap-4 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">{t('common.close')}</button>
                    <button type="button" onClick={processCSV} disabled={!file || isProcessing} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed">
                        {isProcessing ? t('studentsPage.importModal.processing') : t('studentsPage.import')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const StudentsPage: React.FC = () => {
    const { t } = useI18n();
    const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');

    const handleAdd = () => {
        setEditingStudent(null);
        setIsModalOpen(true);
    };

    const handleEdit = (student: Student) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    const handleDelete = (studentId: string) => {
        if(window.confirm(t('studentsPage.confirmDelete'))) {
            setStudents(students.filter(s => s.id !== studentId));
        }
    };

    const handleSave = (student: Student) => {
        if (editingStudent) {
            setStudents(students.map(s => (s.id === editingStudent.id ? { ...student, id: s.id } : s)));
        } else {
            setStudents([...students, { ...student, id: `s${students.length + 1 + Math.random()}` }]);
        }
        setIsModalOpen(false);
        setEditingStudent(null);
    };

    const handleBulkImport = (newStudents: Student[]) => {
        const existingRollNumbers = new Set(students.map(s => s.rollNumber));
        const trulyNewStudents = newStudents.filter(s => !existingRollNumbers.has(s.rollNumber));
        const duplicateCount = newStudents.length - trulyNewStudents.length;

        const studentsWithIds = trulyNewStudents.map((student, index) => ({
            ...student,
            id: `s${students.length + index + 1 + Math.random()}`
        }));
        
        setStudents(prev => [...prev, ...studentsWithIds]);
        return { newCount: trulyNewStudents.length, duplicateCount };
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterDepartment === 'all' || student.department === filterDepartment;
        return matchesSearch && matchesFilter;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('studentsPage.pageTitle')}</h1>
                <div className="space-x-2">
                    <button onClick={() => setIsImportModalOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">{t('studentsPage.import')}</button>
                    <button onClick={handleAdd} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{t('studentsPage.add')}</button>
                </div>
            </div>

            <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-wrap gap-4 items-center">
                <input
                    type="text"
                    placeholder={t('studentsPage.searchPlaceholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <select 
                    value={filterDepartment} 
                    onChange={e => setFilterDepartment(e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="all">All Departments</option>
                    {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                </select>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('common.name')}</th>
                            <th scope="col" className="px-6 py-3">{t('common.rollNumber')}</th>
                            <th scope="col" className="px-6 py-3">{t('common.class')}</th>
                            <th scope="col" className="px-6 py-3">{t('common.department')}</th>
                            <th scope="col" className="px-6 py-3">{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map(student => (
                            <tr key={student.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{student.name}</td>
                                <td className="px-6 py-4">{student.rollNumber}</td>
                                <td className="px-6 py-4">{student.class}</td>
                                <td className="px-6 py-4">{student.department}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => handleEdit(student)} className="font-medium text-indigo-600 dark:text-indigo-500 hover:underline">{t('common.edit')}</button>
                                    <button onClick={() => handleDelete(student.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">{t('common.delete')}</button>
                                </td>
                            </tr>
                        ))}
                        {filteredStudents.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-4">{t('studentsPage.noStudentsFound')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <StudentModal student={editingStudent} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
            {isImportModalOpen && <StudentImportModal onClose={() => setIsImportModalOpen(false)} onImport={handleBulkImport} />}
        </div>
    );
};

export default StudentsPage;