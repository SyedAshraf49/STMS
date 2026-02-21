import { Student, AttendanceRecord, LeaveRequest, AttendanceStatus, LeaveStatus, TimetableEntry, Announcement, Notification, UserRole } from '../types';

const getDateString = (dayOffset: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    return date.toISOString().slice(0, 10);
};

export const CLASS_INCHARGE_TEACHER_ID = 't3';

// --- AUTHENTICATION DATA ---

export const MOCK_USERS = [
    // Admin
    { id: 'admin1', name: 'Super Admin', email: 'admin@school.com', password: 'password', role: UserRole.ADMIN },
    
    // Teachers
    { id: 't1', name: 'IoT Mam', email: 'teacher1@school.com', password: 'password', role: UserRole.TEACHER },
    { id: 't2', name: 'Big Data Analytics Mam', email: 'teacher2@school.com', password: 'password', role: UserRole.TEACHER },
    { id: 't3', name: 'NM mam', email: 'teacher3@school.com', password: 'password', role: UserRole.TEACHER },
    { id: 't4', name: 'ASP.NET mam', email: 'teacher4@school.com', password: 'password', role: UserRole.TEACHER },
    { id: 't5', name: 'OPERATING SYSTEM mam', email: 'teacher5@school.com', password: 'password', role: UserRole.TEACHER },

    // Students
    { id: 's1', name: 'Logeshwaran', email: 'logeshwaran@student.com', password: 'password', role: UserRole.STUDENT },
    { id: 's2', name: 'Ashraf', email: 'ashraf@student.com', password: 'password', role: UserRole.STUDENT },
    { id: 's3', name: 'Deena', email: 'deena@student.com', password: 'password', role: UserRole.STUDENT },
    { id: 's4', name: 'Aravindan', email: 'aravindan@student.com', password: 'password', role: UserRole.STUDENT },
    { id: 's5', name: 'Prakash', email: 'prakash@student.com', password: 'password', role: UserRole.STUDENT },
    { id: 's6', name: 'Akash', email: 'akash@student.com', password: 'password', role: UserRole.STUDENT },
    { id: 's7', name: 'Sheyam', email: 'sheyam@student.com', password: 'password', role: UserRole.STUDENT },
    { id: 's8', name: 'Musharaf', email: 'musharaf@student.com', password: 'password', role: UserRole.STUDENT },

    // Parents
    { id: 'p1', name: 'Logeshwaran Parent', email: 'parent.logeshwaran@school.com', password: 'password', role: UserRole.PARENT },
    { id: 'p2', name: 'Ashraf Parent', email: 'parent.ashraf@school.com', password: 'password', role: UserRole.PARENT },
    { id: 'p3', name: 'Deena Parent', email: 'parent.deena@school.com', password: 'password', role: UserRole.PARENT },
    { id: 'p4', name: 'Aravindan Parent', email: 'parent.aravindan@school.com', password: 'password', role: UserRole.PARENT },
    { id: 'p5', name: 'Prakash Parent', email: 'parent.prakash@school.com', password: 'password', role: UserRole.PARENT },
    { id: 'p6', name: 'Akash Parent', email: 'parent.akash@school.com', password: 'password', role: UserRole.PARENT },
    { id: 'p7', name: 'Sheyam Parent', email: 'parent.sheyam@school.com', password: 'password', role: UserRole.PARENT },
    { id: 'p8', name: 'Musharaf Parent', email: 'parent.musharaf@school.com', password: 'password', role: UserRole.PARENT },
];

// --- APP DATA ---

export const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'Logeshwaran', rollNumber: 'CS101-01', class: 'CS101', department: 'Computer Science', parentId: 'p1' },
  { id: 's2', name: 'Ashraf', rollNumber: 'CS101-02', class: 'CS101', department: 'Computer Science', parentId: 'p2' },
  { id: 's3', name: 'Deena', rollNumber: 'CS101-03', class: 'CS101', department: 'Computer Science', parentId: 'p3' },
  { id: 's4', name: 'Aravindan', rollNumber: 'CS101-04', class: 'CS101', department: 'Computer Science', parentId: 'p4' },
  { id: 's5', name: 'Prakash', rollNumber: 'CS101-05', class: 'CS101', department: 'Computer Science', parentId: 'p5' },
  { id: 's6', name: 'Akash', rollNumber: 'CS101-06', class: 'CS101', department: 'Computer Science', parentId: 'p6' },
  { id: 's7', name: 'Sheyam', rollNumber: 'CS101-07', class: 'CS101', department: 'Computer Science', parentId: 'p7' },
  { id: 's8', name: 'Musharaf', rollNumber: 'CS101-08', class: 'CS101', department: 'Computer Science', parentId: 'p8' },
];

const PERIOD_SUBJECTS: Array<{ subject: string; teacherId: string }> = [
  { subject: 'IoT', teacherId: 't1' },
  { subject: 'Big Data Analytics', teacherId: 't2' },
  { subject: 'NM', teacherId: 't3' },
  { subject: 'ASP.NET', teacherId: 't4' },
  { subject: 'Operating System', teacherId: 't5' },
];

const ATTENDANCE_DAY_OFFSETS = [0, -1, -2, -3, -4];

const getMockAttendanceStatus = (
  dayOffset: number,
  studentIndex: number,
  periodIndex: number
): AttendanceStatus => {
  const seed = Math.abs(dayOffset) + studentIndex + periodIndex;
  if (seed % 9 === 0) return AttendanceStatus.LEAVE;
  if (seed % 7 === 0) return AttendanceStatus.ABSENT;
  if (seed % 5 === 0) return AttendanceStatus.LATE;
  return AttendanceStatus.PRESENT;
};

export const MOCK_ATTENDANCE: AttendanceRecord[] = ATTENDANCE_DAY_OFFSETS.flatMap((dayOffset, dayIndex) =>
  MOCK_STUDENTS.flatMap((student, studentIndex) =>
    PERIOD_SUBJECTS.map((period, periodIndex) => ({
      id: `a${dayIndex * MOCK_STUDENTS.length * PERIOD_SUBJECTS.length + studentIndex * PERIOD_SUBJECTS.length + periodIndex + 1}`,
      studentId: student.id,
      date: getDateString(dayOffset),
      subject: period.subject,
      status: getMockAttendanceStatus(dayOffset, studentIndex, periodIndex),
      markedBy: period.teacherId,
    }))
  )
);

const ATTENDANCE_LEAVE_ENTRIES = MOCK_ATTENDANCE.filter(record => record.status === AttendanceStatus.LEAVE);

const UNIQUE_LEAVE_ENTRIES = ATTENDANCE_LEAVE_ENTRIES.filter(
  (entry, index, self) =>
    self.findIndex(candidate => candidate.studentId === entry.studentId && candidate.date === entry.date) === index
);

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = UNIQUE_LEAVE_ENTRIES.map((entry, index) => {
  const parentStatus =
    index % 3 === 0
      ? LeaveStatus.APPROVED
      : index % 3 === 1
        ? LeaveStatus.PENDING
        : LeaveStatus.REJECTED;

  const status =
    parentStatus === LeaveStatus.APPROVED
      ? (index % 2 === 0 ? LeaveStatus.APPROVED : LeaveStatus.PENDING)
      : parentStatus === LeaveStatus.REJECTED
        ? LeaveStatus.REJECTED
        : LeaveStatus.PENDING;

  return {
    id: `l${index + 1}`,
    studentId: entry.studentId,
    startDate: entry.date,
    endDate: entry.date,
    reason: `Leave marked during ${entry.subject} period`,
    status,
    parentStatus,
  };
});

export const MOCK_TIMETABLE: TimetableEntry[] = [
  // Monday
  { id: 'tt1', day: 'Monday', time: '09:00 - 10:00', subject: 'IoT', class: 'CS101', teacherId: 't1' },
  { id: 'tt2', day: 'Monday', time: '10:00 - 11:00', subject: 'Big Data Analytics', class: 'CS101', teacherId: 't2' },
  { id: 'tt3', day: 'Monday', time: '11:00 - 12:00', subject: 'NM', class: 'CS101', teacherId: 't3' },
  { id: 'tt4', day: 'Monday', time: '13:00 - 14:00', subject: 'ASP.NET', class: 'CS101', teacherId: 't4' },
  { id: 'tt5', day: 'Monday', time: '14:00 - 15:00', subject: 'Operating System', class: 'CS101', teacherId: 't5' },

  // Tuesday
  { id: 'tt6', day: 'Tuesday', time: '09:00 - 10:00', subject: 'Operating System', class: 'CS101', teacherId: 't5' },
  { id: 'tt7', day: 'Tuesday', time: '10:00 - 11:00', subject: 'IoT', class: 'CS101', teacherId: 't1' },
  { id: 'tt8', day: 'Tuesday', time: '11:00 - 12:00', subject: 'ASP.NET', class: 'CS101', teacherId: 't4' },
  { id: 'tt9', day: 'Tuesday', time: '13:00 - 14:00', subject: 'Big Data Analytics', class: 'CS101', teacherId: 't2' },
  { id: 'tt10', day: 'Tuesday', time: '14:00 - 15:00', subject: 'NM', class: 'CS101', teacherId: 't3' },

  // Wednesday
  { id: 'tt11', day: 'Wednesday', time: '09:00 - 10:00', subject: 'NM', class: 'CS101', teacherId: 't3' },
  { id: 'tt12', day: 'Wednesday', time: '10:00 - 11:00', subject: 'Operating System', class: 'CS101', teacherId: 't5' },
  { id: 'tt13', day: 'Wednesday', time: '11:00 - 12:00', subject: 'Big Data Analytics', class: 'CS101', teacherId: 't2' },
  { id: 'tt14', day: 'Wednesday', time: '13:00 - 14:00', subject: 'IoT', class: 'CS101', teacherId: 't1' },
  { id: 'tt15', day: 'Wednesday', time: '14:00 - 15:00', subject: 'ASP.NET', class: 'CS101', teacherId: 't4' },

  // Thursday
  { id: 'tt16', day: 'Thursday', time: '09:00 - 10:00', subject: 'ASP.NET', class: 'CS101', teacherId: 't4' },
  { id: 'tt17', day: 'Thursday', time: '10:00 - 11:00', subject: 'NM', class: 'CS101', teacherId: 't3' },
  { id: 'tt18', day: 'Thursday', time: '11:00 - 12:00', subject: 'Operating System', class: 'CS101', teacherId: 't5' },
  { id: 'tt19', day: 'Thursday', time: '13:00 - 14:00', subject: 'IoT', class: 'CS101', teacherId: 't1' },
  { id: 'tt20', day: 'Thursday', time: '14:00 - 15:00', subject: 'Big Data Analytics', class: 'CS101', teacherId: 't2' },

  // Friday
  { id: 'tt21', day: 'Friday', time: '09:00 - 10:00', subject: 'Big Data Analytics', class: 'CS101', teacherId: 't2' },
  { id: 'tt22', day: 'Friday', time: '10:00 - 11:00', subject: 'ASP.NET', class: 'CS101', teacherId: 't4' },
  { id: 'tt23', day: 'Friday', time: '11:00 - 12:00', subject: 'IoT', class: 'CS101', teacherId: 't1' },
  { id: 'tt24', day: 'Friday', time: '13:00 - 14:00', subject: 'NM', class: 'CS101', teacherId: 't3' },
  { id: 'tt25', day: 'Friday', time: '14:00 - 15:00', subject: 'Operating System', class: 'CS101', teacherId: 't5' },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: 'an1', title: 'Mid-term Exams Schedule', content: 'The mid-term exams will commence from next Monday. Please check the notice board for the detailed schedule.', date: getDateString(-2), author: 'Admin' },
  { id: 'an2', title: 'Project Submission Deadline', content: 'The deadline for the IoT project has been extended by one week.', date: getDateString(-3), author: 'IoT Mam' },
];

const getStudentNameById = (studentId: string): string =>
  MOCK_STUDENTS.find(student => student.id === studentId)?.name || 'Student';

const getParentIdByStudentId = (studentId: string): string | undefined =>
  MOCK_STUDENTS.find(student => student.id === studentId)?.parentId;

export const MOCK_NOTIFICATIONS: Notification[] = MOCK_LEAVE_REQUESTS.flatMap((request, index) => {
  const studentName = getStudentNameById(request.studentId);
  const parentId = getParentIdByStudentId(request.studentId);
  const baseId = index * 2;
  const timestamp = new Date(Date.now() - index * 3600000).toISOString();

  const notifications: Notification[] = [
    {
      id: `n${baseId + 1}`,
      userId: CLASS_INCHARGE_TEACHER_ID,
      message: `Leave request from ${studentName} for ${request.startDate} is ${request.status.toLowerCase()}.`,
      read: request.status === LeaveStatus.APPROVED,
      date: timestamp,
    },
  ];

  if (parentId) {
    notifications.push({
      id: `n${baseId + 2}`,
      userId: parentId,
      message:
        request.parentStatus === LeaveStatus.PENDING
          ? `A leave request from ${studentName} for ${request.startDate} requires your approval.`
          : `${studentName}'s leave request for ${request.startDate} is ${request.parentStatus.toLowerCase()}.`,
      read: request.parentStatus !== LeaveStatus.PENDING,
      date: timestamp,
    });
  }

  return notifications;
});