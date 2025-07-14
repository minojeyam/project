// Core Models for IO Space Educational Management System

// ============================================================================
// USER MANAGEMENT MODELS
// ============================================================================

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional for security
  role: UserRole;
  phoneNumber?: string;
  profilePicture?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  
  // Role-specific fields
  locationId?: string; // For teachers and students
  classIds?: string[]; // Classes associated with user
  parentEmail?: string; // For students
  studentIds?: string[]; // For parents
  
  // Additional profile information
  dateOfBirth?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  
  // Academic information (for students)
  enrollmentNumber?: string;
  admissionDate?: string;
  graduationDate?: string;
  
  // Employment information (for teachers)
  employeeId?: string;
  joiningDate?: string;
  qualification?: string[];
  experience?: number; // years
  subjects?: string[];
}

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended' | 'graduated';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
}

// ============================================================================
// LOCATION MANAGEMENT MODELS
// ============================================================================

export interface Location {
  id: string;
  name: string;
  code: string; // Short code for location (e.g., "NEL", "CHV")
  address: Address;
  phoneNumber: string;
  email: string;
  capacity: number;
  currentEnrollment: number;
  status: LocationStatus;
  
  // Facility information
  facilities: Facility[];
  operatingHours: OperatingHours;
  
  // Administrative
  principalId?: string;
  establishedDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  
  // Branding
  logo?: string;
  color?: string;
  description?: string;
}

export type LocationStatus = 'active' | 'inactive' | 'maintenance' | 'construction';

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  capacity?: number;
  description?: string;
  available: boolean;
}

export type FacilityType = 'classroom' | 'laboratory' | 'library' | 'auditorium' | 'playground' | 'cafeteria' | 'parking' | 'other';

export interface OperatingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string; // HH:MM format
  closeTime?: string; // HH:MM format
  breaks?: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  description?: string;
}

// ============================================================================
// CLASS MANAGEMENT MODELS
// ============================================================================

export interface Class {
  id: string;
  title: string;
  code: string; // Class code (e.g., "MATH-7A")
  level: string; // Grade/Level
  subject: string;
  description?: string;
  
  // Location and assignment
  locationId: string;
  teacherId: string;
  assistantTeacherIds?: string[];
  
  // Schedule
  schedule: ClassSchedule;
  
  // Enrollment
  capacity: number;
  currentEnrollment: number;
  enrolledStudents: StudentEnrollment[];
  waitingList?: StudentEnrollment[];
  
  // Academic period
  startDate: string;
  endDate: string;
  status: ClassStatus;
  
  // Fee structure
  fees: FeeStructure[];
  
  // Academic content
  syllabus?: Syllabus;
  materials: Material[];
  assignments: Assignment[];
  exams: Exam[];
  
  // Administrative
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ClassStatus = 'active' | 'inactive' | 'completed' | 'cancelled' | 'suspended';

export interface ClassSchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  duration: number; // minutes
  roomNumber?: string;
  recurring: boolean;
  exceptions?: ScheduleException[];
}

export interface ScheduleException {
  date: string;
  type: 'cancelled' | 'rescheduled' | 'holiday';
  newTime?: TimeSlot;
  reason?: string;
}

export interface StudentEnrollment {
  studentId: string;
  enrollmentDate: string;
  status: EnrollmentStatus;
  finalGrade?: string;
  completionDate?: string;
  notes?: string;
}

export type EnrollmentStatus = 'active' | 'inactive' | 'completed' | 'dropped' | 'transferred';

// ============================================================================
// FEE MANAGEMENT MODELS
// ============================================================================

export interface FeeStructure {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  frequency: FeeFrequency;
  category: FeeCategory;
  
  // Applicability
  applicableClasses?: string[];
  applicableGrades?: string[];
  applicableLocations?: string[];
  
  // Timing
  dueDay?: number; // Day of month when due
  gracePeriod?: number; // Days after due date
  lateFee?: LateFee;
  
  // Status
  status: FeeStatus;
  effectiveFrom: string;
  effectiveTo?: string;
  
  // Administrative
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type FeeFrequency = 'monthly' | 'quarterly' | 'semester' | 'annual' | 'one-time';
export type FeeCategory = 'tuition' | 'lab' | 'library' | 'sports' | 'transport' | 'exam' | 'activity' | 'other';
export type FeeStatus = 'active' | 'inactive' | 'archived';

export interface LateFee {
  type: 'fixed' | 'percentage';
  amount: number;
  maxAmount?: number;
  applicableAfterDays: number;
}

export interface StudentFee {
  id: string;
  studentId: string;
  classId?: string;
  feeStructureId: string;
  
  // Amount details
  baseAmount: number;
  discountAmount?: number;
  lateFeeAmount?: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  
  // Dates
  dueDate: string;
  paidDate?: string;
  
  // Status
  status: PaymentStatus;
  
  // Payment details
  payments: Payment[];
  
  // Administrative
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'waived' | 'refunded';

export interface Payment {
  id: string;
  studentFeeId: string;
  amount: number;
  method: PaymentMethod;
  
  // Transaction details
  transactionId?: string;
  referenceNumber?: string;
  
  // Dates
  paidDate: string;
  processedDate?: string;
  
  // Status
  status: TransactionStatus;
  
  // Additional details
  receivedBy?: string;
  notes?: string;
  receiptUrl?: string;
  
  // Administrative
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'upi' | 'cheque' | 'online' | 'wallet';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';

// ============================================================================
// ATTENDANCE MANAGEMENT MODELS
// ============================================================================

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  
  // Time tracking
  checkInTime?: string;
  checkOutTime?: string;
  
  // Additional information
  notes?: string;
  markedBy: string;
  markedAt: string;
  
  // Late arrival/early departure
  isLate?: boolean;
  isEarlyDeparture?: boolean;
  
  // Administrative
  createdAt: string;
  updatedAt: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'sick' | 'holiday';

export interface AttendanceReport {
  studentId: string;
  classId: string;
  period: {
    startDate: string;
    endDate: string;
  };
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendancePercentage: number;
}

// ============================================================================
// ACADEMIC CONTENT MODELS
// ============================================================================

export interface Syllabus {
  id: string;
  classId: string;
  title: string;
  description?: string;
  
  // Content structure
  modules: SyllabusModule[];
  
  // Academic details
  totalHours: number;
  creditHours?: number;
  prerequisites?: string[];
  learningObjectives: string[];
  
  // Assessment
  assessmentCriteria: AssessmentCriteria[];
  gradingScheme: GradingScheme;
  
  // Administrative
  version: string;
  effectiveFrom: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyllabusModule {
  id: string;
  title: string;
  description?: string;
  order: number;
  estimatedHours: number;
  topics: string[];
  learningOutcomes: string[];
}

export interface Material {
  id: string;
  title: string;
  description?: string;
  type: MaterialType;
  
  // Content
  url?: string;
  content?: string;
  fileSize?: number;
  mimeType?: string;
  
  // Classification
  classId?: string;
  moduleId?: string;
  tags: string[];
  
  // Access control
  isPublic: boolean;
  allowedRoles: UserRole[];
  
  // Administrative
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export type MaterialType = 'document' | 'video' | 'audio' | 'image' | 'link' | 'presentation' | 'spreadsheet' | 'other';

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  description: string;
  instructions?: string;
  
  // Timing
  assignedDate: string;
  dueDate: string;
  submissionDeadline?: string;
  
  // Assessment
  totalMarks: number;
  passingMarks?: number;
  weightage?: number; // Percentage of total grade
  
  // Submission
  submissionType: SubmissionType;
  allowLateSubmission: boolean;
  latePenalty?: number; // Percentage deduction per day
  
  // Content
  attachments: Material[];
  
  // Status
  status: AssignmentStatus;
  
  // Submissions
  submissions: AssignmentSubmission[];
  
  // Administrative
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type SubmissionType = 'online' | 'offline' | 'both';
export type AssignmentStatus = 'draft' | 'published' | 'closed' | 'graded';

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  
  // Submission content
  content?: string;
  attachments: Material[];
  
  // Timing
  submittedAt: string;
  isLate: boolean;
  
  // Grading
  marks?: number;
  grade?: string;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
  
  // Status
  status: SubmissionStatus;
  
  // Administrative
  createdAt: string;
  updatedAt: string;
}

export type SubmissionStatus = 'submitted' | 'graded' | 'returned' | 'resubmitted';

export interface Exam {
  id: string;
  classId: string;
  title: string;
  description?: string;
  type: ExamType;
  
  // Timing
  examDate: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  
  // Assessment
  totalMarks: number;
  passingMarks: number;
  weightage?: number; // Percentage of total grade
  
  // Logistics
  venue?: string;
  instructions?: string;
  allowedMaterials?: string[];
  
  // Status
  status: ExamStatus;
  
  // Results
  results: ExamResult[];
  
  // Administrative
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ExamType = 'quiz' | 'test' | 'midterm' | 'final' | 'practical' | 'oral' | 'project';
export type ExamStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'postponed';

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  
  // Scores
  marksObtained: number;
  grade: string;
  percentage: number;
  
  // Status
  status: ResultStatus;
  
  // Additional details
  remarks?: string;
  
  // Administrative
  evaluatedBy: string;
  evaluatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type ResultStatus = 'pass' | 'fail' | 'absent' | 'pending' | 'withheld';

// ============================================================================
// GRADING SYSTEM MODELS
// ============================================================================

export interface GradingScheme {
  id: string;
  name: string;
  description?: string;
  type: GradingType;
  
  // Grade definitions
  grades: GradeDefinition[];
  
  // Settings
  isDefault: boolean;
  applicableClasses?: string[];
  
  // Administrative
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type GradingType = 'letter' | 'percentage' | 'points' | 'pass_fail';

export interface GradeDefinition {
  grade: string;
  minPercentage: number;
  maxPercentage: number;
  gpaPoints?: number;
  description?: string;
  isPassing: boolean;
}

export interface AssessmentCriteria {
  id: string;
  name: string;
  description?: string;
  weightage: number; // Percentage
  type: AssessmentType;
}

export type AssessmentType = 'assignment' | 'quiz' | 'test' | 'project' | 'participation' | 'attendance' | 'final_exam';

// ============================================================================
// COMMUNICATION MODELS
// ============================================================================

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: NoticeType;
  priority: NoticePriority;
  
  // Targeting
  targetAudience: UserRole[];
  locationIds?: string[];
  classIds?: string[];
  userIds?: string[];
  isGlobal: boolean;
  
  // Interaction
  requiresAcknowledgment: boolean;
  allowComments: boolean;
  
  // Timing
  publishDate: string;
  expiresAt?: string;
  
  // Status
  status: NoticeStatus;
  
  // Engagement
  views: NoticeView[];
  acknowledgments: NoticeAcknowledgment[];
  comments: NoticeComment[];
  
  // Attachments
  attachments: Material[];
  
  // Administrative
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type NoticeType = 'general' | 'urgent' | 'event' | 'academic' | 'administrative' | 'holiday' | 'exam';
export type NoticePriority = 'low' | 'medium' | 'high' | 'critical';
export type NoticeStatus = 'draft' | 'published' | 'archived' | 'expired';

export interface NoticeView {
  id: string;
  noticeId: string;
  userId: string;
  viewedAt: string;
}

export interface NoticeAcknowledgment {
  id: string;
  noticeId: string;
  userId: string;
  acknowledgedAt: string;
  notes?: string;
}

export interface NoticeComment {
  id: string;
  noticeId: string;
  userId: string;
  content: string;
  parentCommentId?: string; // For replies
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// REPORTING MODELS
// ============================================================================

export interface Report {
  id: string;
  name: string;
  description?: string;
  type: ReportType;
  category: ReportCategory;
  
  // Configuration
  parameters: ReportParameter[];
  filters: ReportFilter[];
  
  // Data
  query?: string;
  dataSource: string;
  
  // Formatting
  format: ReportFormat;
  template?: string;
  
  // Access control
  allowedRoles: UserRole[];
  isPublic: boolean;
  
  // Scheduling
  isScheduled: boolean;
  schedule?: ReportSchedule;
  
  // Administrative
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ReportType = 'tabular' | 'chart' | 'dashboard' | 'summary' | 'detailed';
export type ReportCategory = 'academic' | 'financial' | 'attendance' | 'enrollment' | 'performance' | 'administrative';
export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'html' | 'json';

export interface ReportParameter {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'select';
  required: boolean;
  defaultValue?: any;
  options?: string[]; // For select type
}

export interface ReportFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'between';
  value: any;
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  time: string; // HH:MM
  dayOfWeek?: number; // For weekly
  dayOfMonth?: number; // For monthly
  recipients: string[]; // Email addresses
  isActive: boolean;
}

export interface ReportExecution {
  id: string;
  reportId: string;
  
  // Execution details
  executedBy: string;
  executedAt: string;
  parameters: Record<string, any>;
  
  // Results
  status: ExecutionStatus;
  resultUrl?: string;
  errorMessage?: string;
  
  // Metadata
  recordCount?: number;
  executionTime?: number; // milliseconds
  fileSize?: number; // bytes
}

export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

// ============================================================================
// SYSTEM CONFIGURATION MODELS
// ============================================================================

export interface SystemSettings {
  id: string;
  category: SettingsCategory;
  key: string;
  value: any;
  dataType: 'string' | 'number' | 'boolean' | 'json' | 'array';
  description?: string;
  isPublic: boolean;
  
  // Validation
  validation?: SettingsValidation;
  
  // Administrative
  updatedBy: string;
  updatedAt: string;
}

export type SettingsCategory = 'general' | 'academic' | 'financial' | 'communication' | 'security' | 'integration';

export interface SettingsValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: string;
  allowedValues?: any[];
}

// ============================================================================
// AUDIT AND LOGGING MODELS
// ============================================================================

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  
  // Details
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  metadata?: Record<string, any>;
  
  // Context
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  
  // Timing
  timestamp: string;
  
  // Status
  status: 'success' | 'failure' | 'error';
  errorMessage?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: ValidationError[];
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  pagination?: PaginationParams;
}

// ============================================================================
// DASHBOARD AND ANALYTICS MODELS
// ============================================================================

export interface DashboardWidget {
  id: string;
  title: string;
  type: WidgetType;
  size: WidgetSize;
  position: WidgetPosition;
  
  // Configuration
  dataSource: string;
  refreshInterval?: number; // seconds
  
  // Permissions
  allowedRoles: UserRole[];
  
  // Data
  data?: any;
  lastUpdated?: string;
  
  // Administrative
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type WidgetType = 'stat' | 'chart' | 'table' | 'list' | 'calendar' | 'progress' | 'map';
export type WidgetSize = 'small' | 'medium' | 'large' | 'extra-large';

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Analytics {
  id: string;
  metric: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercentage?: number;
  period: string;
  timestamp: string;
  metadata?: Record<string, any>;
}