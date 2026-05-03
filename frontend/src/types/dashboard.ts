export type DashboardStats = {
  totalTasks: number;
  byStatus: Record<string, number>;
  perUser: Record<string, number>;
  overdueTasks: number;
};
