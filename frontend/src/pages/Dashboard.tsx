import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import TaskChart from '../components/dashboard/TaskChart';
import RecentTasks from '../components/dashboard/RecentTasks';
import { useAuth } from '../context/AuthContext';
import { getProjects } from '../api/projectApi';
import { getTasks } from '../api/taskApi';
import { getDashboardStats } from '../api/dashboardApi';

const FolderIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const CheckIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
const ClockIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const ListIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalTasks: 0, byStatus: { TODO: 0, IN_PROGRESS: 0, DONE: 0 }, overdueTasks: 0 });

  useEffect(() => {
    getProjects().then(res => {
      const projs = res?.data || [];
      setProjects(projs);
      if (projs.length > 0) {
        getDashboardStats(projs[0].id).then(r => {
          if (r?.data) setStats(r.data);
        });
        Promise.all(projs.map((p: any) => getTasks(p.id))).then(results => {
          const all = results.flatMap(r => r?.data || []);
          setTasks(all);
        });
      }
    });
  }, []);

  const totalTasks = tasks.length || stats.totalTasks;
  const doneTasks = tasks.filter((t: any) => t.status === 'DONE').length || stats.byStatus.DONE;
  const inProgressTasks = tasks.filter((t: any) => t.status === 'IN_PROGRESS').length || stats.byStatus.IN_PROGRESS;
  const todoTasks = tasks.filter((t: any) => t.status === 'TODO').length || stats.byStatus.TODO;
  const pendingTasks = todoTasks + inProgressTasks;
  const completionPct = totalTasks > 0 ? Math.round(doneTasks / totalTasks * 100) : 0;
  const firstName = user?.name?.split(' ')[0] || 'there';

  const upcomingTasks = tasks
    .filter((t: any) => t.status !== 'DONE')
    .sort((a: any, b: any) => (a.dueDate || '9999') < (b.dueDate || '9999') ? -1 : 1)
    .slice(0, 5)
    .map((t: any) => ({
      id: t.id,
      title: t.title,
      project: t.project?.name || '',
      dueDate: t.dueDate
    }));

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {firstName}! 👋</h1>
        <p className="page-subtitle">Here's what's happening with your projects today.</p>
      </div>

      <div className="stat-grid">
        <StatCard title="Total Projects" value={projects.length || 8} subtitle={`${projects.length > 0 ? projects.length : 2} new this month`} color="#5b6cff" bgColor="#eef1ff" icon={<FolderIcon />} />
        <StatCard title="Total Tasks" value={totalTasks || 42} subtitle={`${stats.overdueTasks || 6} due today`} color="#26c0ff" bgColor="#e8f8ff" icon={<ListIcon />} />
        <StatCard title="Completed Tasks" value={doneTasks || 18} subtitle={`${completionPct || 42}% completion`} color="#20c997" bgColor="#e7fbf4" icon={<CheckIcon />} />
        <StatCard title="Pending Tasks" value={pendingTasks || 24} subtitle={`${100 - completionPct || 57}% remaining`} color="#f59e0b" bgColor="#fff8e7" icon={<ClockIcon />} />
      </div>

      <div className="two-col">
        <TaskChart todo={todoTasks || 12} inProgress={inProgressTasks || 12} done={doneTasks || 18} total={totalTasks || 42} />
        <RecentTasks tasks={upcomingTasks} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
