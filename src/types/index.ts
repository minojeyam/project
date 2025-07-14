// Re-export all models from the comprehensive models file
export * from './models';

// Keep legacy interfaces for backward compatibility
export interface DashboardStats {
  totalStudents: number;
  pendingApprovals: number;
  totalTeachers: number;
  totalClasses: number;
  totalLocations: number;
  totalRevenue: number;
  attendanceRate: number;
  overduePayments: number;
}