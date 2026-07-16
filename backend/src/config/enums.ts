export const Role = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
} as const;
export type Role = typeof Role[keyof typeof Role];

export const AdmissionStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;
export type AdmissionStatus = typeof AdmissionStatus[keyof typeof AdmissionStatus];

export const PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  PARTIAL: 'PARTIAL',
  FAILED: 'FAILED',
} as const;
export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export const PaymentMode = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
} as const;
export type PaymentMode = typeof PaymentMode[keyof typeof PaymentMode];

export const FeeType = {
  ADMISSION: 'ADMISSION',
  TUITION: 'TUITION',
  EXAM: 'EXAM',
  OTHER: 'OTHER',
} as const;
export type FeeType = typeof FeeType[keyof typeof FeeType];

export const AttendanceStatus = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
} as const;
export type AttendanceStatus = typeof AttendanceStatus[keyof typeof AttendanceStatus];

export const TicketPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;
export type TicketPriority = typeof TicketPriority[keyof typeof TicketPriority];

export const TicketStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  CLOSED: 'CLOSED',
} as const;
export type TicketStatus = typeof TicketStatus[keyof typeof TicketStatus];

export const AudienceType = {
  ALL: 'ALL',
  STUDENTS: 'STUDENTS',
  TEACHERS: 'TEACHERS',
} as const;
export type AudienceType = typeof AudienceType[keyof typeof AudienceType];
