import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { getProjects } from '../api/projectApi';
import { getTasks, createTask, updateTask } from '../api/taskApi';
import { getUsers } from '../api/dashboardApi';
import { useAuth } from '../context/AuthContext';

const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const SearchIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const FilterIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;

type Role = 'ADMIN' | 'MEMBER';
type Task = {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string | null;
  projectId: number;
  project?: { name: string };
  assignee?: { id: number; name: string } | null;
};
type ProjectMember = { role: Role; user: { id: number } };
type Project = { id: number; name: string; members?: ProjectMember[] };

const statusMap: Record<string, { label: string; cls: string }> = {
  TODO: { label: 'To Do', cls: 'badge-todo' },
  IN_PROGRESS: { label: 'In Progress', cls: 'badge-inprogress' },
  DONE: { label: 'Completed', cls: 'badge-done' },
};

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '', projectId: '', assigneeId: '' });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [pageError, setPageError] = useState('');

  const adminProjects = useMemo(() => {
    if (!user) return [];
    return projects.filter(p => p.members?.some(m => m.user.id === user.id && m.role === 'ADMIN'));
  }, [projects, user]);

  const load = async () => {
    setLoading(true);
    setPageError('');
    try {
      const projRes = await getProjects();
      const projs = projRes?.data || [];
      setProjects(projs);

      if (projs.length > 0) {
        const all = await Promise.all(projs.map((p: Project) => getTasks(p.id)));
        const flat = all.flatMap(r => r?.data || []);
        setTasks(flat);
      } else {
        setTasks([]);
      }

      if (user) {
        const adminProjectIds = projs
          .filter((p: Project) => p.members?.some(m => m.user.id === user.id && m.role === 'ADMIN'))
          .map((p: Project) => p.id);

        if (adminProjectIds.length > 0) {
          const userRes = await getUsers();
          setUsers(userRes?.data || []);
        } else {
          setUsers([]);
        }
      }
    } catch {
      setPageError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = tasks.filter(t => {
    const statusMatch = activeFilter === 'All' || 
      (activeFilter === 'To Do' && t.status === 'TODO') ||
      (activeFilter === 'In Progress' && t.status === 'IN_PROGRESS') ||
      (activeFilter === 'Completed' && t.status === 'DONE');
    const searchMatch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.projectId) return;
    setCreateError('');
    setCreating(true);
    try {
      const res = await createTask(parseInt(form.projectId), {
        title: form.title,
        description: form.description,
        priority: form.priority,
        dueDate: form.dueDate || undefined,
        assigneeId: form.assigneeId ? parseInt(form.assigneeId) : undefined
      });

      if (res?.success === false) {
        setCreateError(res?.error?.message || 'Failed to create task.');
        return;
      }

      setShowModal(false);
      setForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '', projectId: '', assigneeId: '' });
      await load();
    } catch {
      setCreateError('Failed to create task.');
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: string) => {
    if (task.id < 0) return;
    setPageError('');
    try {
      const res = await updateTask(task.projectId, task.id, { status: newStatus });
      if (res?.success === false) {
        setPageError(res?.error?.message || 'Failed to update task.');
        return;
      }
      await load();
    } catch {
      setPageError('Failed to update task.');
    }
  };

  const filters = ['All', 'To Do', 'In Progress', 'Completed'];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Tasks</h1>
            <p className="page-subtitle">Track work across teams and projects.</p>
          </div>
          {adminProjects.length > 0 && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setCreateError('');
                if (!form.projectId && adminProjects[0]) {
                  setForm(prev => ({ ...prev, projectId: String(adminProjects[0].id) }));
                }
                setShowModal(true);
              }}
            >
              <PlusIcon /> New Task
            </button>
          )}
        </div>
      </div>

      <div className="panel">
        {pageError && <div className="form-error" style={{ marginBottom: 10 }}>{pageError}</div>}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div className="filter-tabs">
            {filters.map(f => (
              <button key={f} className={`filter-tab${activeFilter === f ? ' active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="search-wrap">
              <SearchIcon />
              <input className="search-input" placeholder="Search tasks…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="icon-btn"><FilterIcon /></button>
          </div>
        </div>

        {loading ? (
          <div className="empty-state"><p style={{ color: 'var(--text-muted)' }}>Loading tasks…</p></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 32 }}></th>
                <th>Task</th>
                <th>Project</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(task => {
                const s = statusMap[task.status] || statusMap.TODO;
                const due = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
                return (
                  <tr key={task.id}>
                    <td><input type="checkbox" className="cb" /></td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{task.title}</div>
                      {task.assignee && <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{task.assignee.name}</div>}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{task.project?.name || '—'}</td>
                    <td>
                      <select
                        className={`status-badge ${s.cls}`}
                        value={task.status}
                        onChange={e => handleStatusChange(task, e.target.value)}
                        style={{ border: 'none', background: 'inherit', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Completed</option>
                      </select>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{due}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5}><div className="empty-state"><p style={{ color: 'var(--text-muted)' }}>No tasks found.</p></div></td></tr>
              )}
            </tbody>
          </table>
        )}
        {filtered.length > 0 && <div style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: 12 }}>Showing 1 to {filtered.length} of {filtered.length} tasks</div>}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setCreateError(''); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Create New Task</span>
              <button className="modal-close" onClick={() => { setShowModal(false); setCreateError(''); }}>✕</button>
            </div>
            <form onSubmit={handleCreate} className="form-grid">
              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input className="form-input" placeholder="Enter task title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="Task description…" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Project *</label>
                  <select className="form-select" value={form.projectId} onChange={e => setForm({...form, projectId: e.target.value})} required>
                    <option value="">Select project</option>
                    {adminProjects.map((p: Project) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-select" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input type="date" className="form-input" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Assign To</label>
                  <select className="form-select" value={form.assigneeId} onChange={e => setForm({...form, assigneeId: e.target.value})}>
                    <option value="">Unassigned</option>
                    {users.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
              {createError && <div className="form-error">{createError}</div>}
              <div className="modal-footer" style={{ marginTop: 0 }}>
                <button type="button" className="btn btn-ghost" onClick={() => { setShowModal(false); setCreateError(''); }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Creating...' : 'Create Task'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Tasks;
