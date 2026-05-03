import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { getProjects, createProject, addMember } from '../api/projectApi';

const projectColors = [
  { bg: '#eef1ff', icon: '#5b6cff', emoji: '🖥️' },
  { bg: '#e8f8ff', icon: '#26c0ff', emoji: '📱' },
  { bg: '#e7fbf4', icon: '#20c997', emoji: '⚙️' },
  { bg: '#fff8e7', icon: '#f59e0b', emoji: '📣' },
  { bg: '#fef2f2', icon: '#ef4444', emoji: '🛒' },
  { bg: '#f5f3ff', icon: '#7c3aed', emoji: '📊' },
];

const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;

type Project = { id: number; name: string; description?: string; tasks?: any[]; members?: any[]; };

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await getProjects();
    setProjects(res?.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    await createProject({ name: newName.trim(), description: newDesc.trim() });
    setNewName(''); setNewDesc('');
    setShowModal(false);
    setCreating(false);
    load();
  };

  const DEMO_PROJECTS = [
    { id: -1, name: 'Website Redesign', tasks: Array(4), members: Array(2) },
    { id: -2, name: 'Mobile App', tasks: Array(6), members: Array(3) },
    { id: -3, name: 'Backend Service', tasks: Array(5), members: Array(2) },
    { id: -4, name: 'Marketing Campaign', tasks: Array(3), members: Array(1) },
    { id: -5, name: 'E-commerce Platform', tasks: Array(5), members: Array(4) },
    { id: -6, name: 'Data Analytics', tasks: Array(9), members: Array(2) },
  ];

  const displayProjects = projects.length > 0 ? projects : DEMO_PROJECTS;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Projects</h1>
            <p className="page-subtitle">Manage your team's projects.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <PlusIcon /> New Project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state"><p style={{ color: 'var(--text-muted)' }}>Loading projects…</p></div>
      ) : (
        <div className="projects-grid">
          {displayProjects.map((project, i) => {
            const colorConfig = projectColors[i % projectColors.length];
            const taskCount = (project.tasks || []).length;
            const progress = Math.min(100, taskCount > 0 ? Math.round(Math.random() * 80 + 10) : 0);
            return (
              <div key={project.id} className="project-card">
                <div className="project-icon" style={{ background: colorConfig.bg }}>
                  <span style={{ fontSize: 22 }}>{colorConfig.emoji}</span>
                </div>
                <div className="project-name">{project.name}</div>
                <div className="project-tasks">{taskCount} task{taskCount !== 1 ? 's' : ''}</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%`, background: colorConfig.icon }} />
                </div>
                <div className="progress-label">{progress}%</div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Create New Project</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate} className="form-grid">
              <div className="form-group">
                <label className="form-label">Project Name *</label>
                <input className="form-input" placeholder="e.g. Website Redesign" value={newName} onChange={e => setNewName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="Brief description…" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
              </div>
              <div className="modal-footer" style={{ marginTop: 0 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Creating…' : 'Create Project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Projects;
