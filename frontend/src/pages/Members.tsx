import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { addMember, getProjects, removeMember } from '../api/projectApi';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';

type Role = 'ADMIN' | 'MEMBER';
type ProjectMember = {
  role: Role;
  createdAt?: string;
  user: { id: number; name: string; email: string };
};
type ProjectWithMembers = { id: number; name: string; members?: ProjectMember[] };

const initials = (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
const avatarColors = ['#5b6cff','#20c997','#f59e0b','#ef4444','#26c0ff','#7c3aed'];
const SearchIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;

const Members = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectWithMembers[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState<{ email: string; role: Role }>({ email: '', role: 'MEMBER' });
  const [inviteError, setInviteError] = useState('');
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const loadProjects = async (preferredProjectId?: number) => {
    setLoading(true);
    try {
      const res = await getProjects();
      const data = res?.data || [];
      setProjects(data);
      if (data.length === 0) {
        setActiveProjectId(null);
        return;
      }
      const preferredId = preferredProjectId ?? activeProjectId ?? null;
      const nextId = preferredId && data.some(p => p.id === preferredId) ? preferredId : data[0].id;
      setActiveProjectId(nextId);
    } catch {
      setProjects([]);
      setActiveProjectId(null);
      showToast('Failed to load members.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const members = activeProject?.members || [];

  const isAdmin = Boolean(user && activeProject?.members?.some(m => m.user?.id === user.id && m.role === 'ADMIN'));

  const filtered = members.filter(m => {
    const name = m.user?.name || '';
    const email = m.user?.email || '';
    return !search || name.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase());
  });

  const closeInvite = () => {
    setShowInvite(false);
    setInviteError('');
    setInviteForm({ email: '', role: 'MEMBER' });
  };

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeProject?.id) {
      setInviteError('Select a project before inviting members.');
      return;
    }
    const email = inviteForm.email.trim();
    if (!email) {
      setInviteError('Email is required.');
      return;
    }
    setInviteSubmitting(true);
    setInviteError('');
    try {
      const res = await addMember(activeProject.id, { email, role: inviteForm.role });
      if (res?.success === false) {
        setInviteError(res?.error?.message || 'Failed to invite member.');
        return;
      }
      closeInvite();
      showToast('Invitation sent.', 'success');
      await loadProjects(activeProject.id);
    } catch {
      setInviteError('Failed to invite member.');
    } finally {
      setInviteSubmitting(false);
    }
  };

  const handleRemove = async (memberId: number) => {
    if (!activeProject?.id) return;
    if (memberId === user?.id) {
      showToast('You cannot remove yourself.', 'error');
      return;
    }
    const confirmed = window.confirm('Remove this member from the project?');
    if (!confirmed) return;

    setRemovingUserId(memberId);
    try {
      const res = await removeMember(activeProject.id, memberId);
      if (res?.success === false) {
        showToast(res?.error?.message || 'Failed to remove member.', 'error');
        return;
      }
      showToast('Member removed.', 'success');
      await loadProjects(activeProject.id);
    } catch {
      showToast('Failed to remove member.', 'error');
    } finally {
      setRemovingUserId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Members</h1>
            <p className="page-subtitle">Manage your team members and their roles.</p>
          </div>
          {isAdmin && activeProject && (
            <button className="btn btn-primary" onClick={() => setShowInvite(true)}>+ Invite Member</button>
          )}
        </div>
      </div>

      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{filtered.length} member{filtered.length !== 1 ? 's' : ''}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <select
              className="form-select"
              value={activeProjectId ?? ''}
              onChange={e => setActiveProjectId(Number(e.target.value))}
              style={{ minWidth: 180 }}
              disabled={projects.length === 0}
            >
              {projects.length === 0 ? (
                <option value="">No projects</option>
              ) : (
                projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
              )}
            </select>
            <div className="search-wrap">
              <SearchIcon />
              <input className="search-input" placeholder="Search members…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
        {loading ? (
          <div className="empty-state"><p style={{ color: 'var(--text-muted)' }}>Loading members…</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No members found</div>
            <div className="empty-state-sub">Invite teammates to start collaborating.</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Email</th>
                <th>Status</th>
                <th>Joined</th>
                {isAdmin && <th></th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => {
                const displayName = m.user?.name || m.user?.email || 'Unknown';
                const memberId = m.user?.id;
                const isSelf = memberId === user?.id;
                return (
                  <tr key={`${m.user?.id || i}-${m.role}`}>
                    <td>
                      <div className="member-row">
                        <div className="member-avatar" style={{ background: avatarColors[i % avatarColors.length] }}>{initials(displayName)}</div>
                        <span className="member-name">{displayName}</span>
                      </div>
                    </td>
                    <td><span className={`status-badge ${m.role === 'ADMIN' ? 'badge-admin' : 'badge-member'}`}>{m.role === 'ADMIN' ? 'Admin' : 'Member'}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{m.user?.email || '—'}</td>
                    <td><span className="status-badge badge-active">Active</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                    {isAdmin && (
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-danger btn-sm"
                          disabled={!memberId || isSelf || removingUserId === memberId}
                          onClick={() => memberId && handleRemove(memberId)}
                          title={isSelf ? 'You cannot remove yourself.' : 'Remove member'}
                        >
                          {removingUserId === memberId ? 'Removing...' : 'Remove'}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showInvite && (
        <Modal title="Invite Member" onClose={closeInvite}>
          <form onSubmit={handleInvite} className="form-grid">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="user@example.com"
                value={inviteForm.email}
                onChange={e => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={inviteForm.role}
                onChange={e => setInviteForm(prev => ({ ...prev, role: e.target.value as Role }))}
              >
                <option value="ADMIN">Admin</option>
                <option value="MEMBER">Member</option>
              </select>
            </div>
            {inviteError && <div className="form-error">{inviteError}</div>}
            <div className="modal-footer" style={{ marginTop: 6 }}>
              <button type="button" className="btn btn-ghost" onClick={closeInvite}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={inviteSubmitting}>
                {inviteSubmitting ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {toast && (
        <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
          {toast.message}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Members;
