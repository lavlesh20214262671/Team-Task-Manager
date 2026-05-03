import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
  '/calendar': 'Calendar',
  '/members': 'Members',
  '/profile': 'Profile',
  '/settings': 'Settings'
};

const BellIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const MenuIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const title = pageTitles[location.pathname] || 'Team Task Manager';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-btn" style={{ border: 'none' }}><MenuIcon /></button>
        <span className="topbar-title">{title}</span>
      </div>
      <div className="topbar-right">
        <button className="icon-btn" onClick={() => navigate('/tasks')}>
          <BellIcon />
          <span className="badge">6</span>
        </button>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/tasks')}>
          <PlusIcon /> New Task
        </button>
        <button className="btn btn-ghost btn-sm" onClick={signOut} style={{ fontSize: 12 }}>Sign out</button>
      </div>
    </header>
  );
};

export default Topbar;
