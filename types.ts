export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  department: string;
  parentId?: string;
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late',
  LATE_PRESENT = 'LatePresent',
  LEAVE = 'Leave',
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  subject: string;
  status: AttendanceStatus;
  markedBy: string; // teacherId
}

export enum LeaveStatus {
    PENDING = 'Pending',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
}

export interface LeaveRequest {
    id: string;
    studentId: string;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    reason: string;
    status: LeaveStatus;
    parentStatus: LeaveStatus;
}

export interface TimetableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  time: string; // e.g., "09:00 - 10:00"
  subject: string;
  class: string;
  teacherId: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
  author: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  date: string; // ISO string
}