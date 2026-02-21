export interface AttendanceCodePayload {
  date: string;
  className: string;
  subject: string;
}

const normalizeText = (value: string): string =>
  value.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_');

const normalizeSubjectForMatch = (value: string): string =>
  value.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '');

const getChecksum = (raw: string): string => {
  const hash = raw
    .split('')
    .reduce((acc, char, index) => (acc + char.charCodeAt(0) * (index + 1)) % 100000, 0);
  return hash.toString().padStart(5, '0');
};

export const generateAttendanceCode = ({ date, className, subject }: AttendanceCodePayload): string => {
  const compactDate = date.replace(/-/g, '');
  const classToken = normalizeText(className);
  const subjectToken = normalizeText(subject);
  const checksum = getChecksum(`${compactDate}|${classToken}|${subjectToken}`);
  return `ATD-${compactDate}-${classToken}-${subjectToken}-${checksum}`;
};

export const decodeAttendanceCode = (
  code: string,
  availableSubjects: string[]
): AttendanceCodePayload | null => {
  const parts = code.trim().toUpperCase().split('-');
  if (parts.length < 5 || parts[0] !== 'ATD') return null;

  const compactDate = parts[1];
  if (!/^\d{8}$/.test(compactDate)) return null;

  const classToken = parts[2];
  const checksum = parts[parts.length - 1];
  const subjectToken = parts.slice(3, -1).join('-');

  const expectedChecksum = getChecksum(`${compactDate}|${classToken}|${subjectToken}`);
  if (checksum !== expectedChecksum) return null;

  const matchedSubject = availableSubjects.find(
    subject => normalizeSubjectForMatch(subject) === normalizeSubjectForMatch(subjectToken)
  );

  if (!matchedSubject) return null;

  const date = `${compactDate.slice(0, 4)}-${compactDate.slice(4, 6)}-${compactDate.slice(6, 8)}`;
  return {
    date,
    className: classToken,
    subject: matchedSubject,
  };
};
