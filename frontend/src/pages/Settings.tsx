import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
  <button className={`toggle ${on ? 'on' : 'off'}`} onClick={onToggle} type="button" />
);

const Settings = () => {
  const [tab, setTab] = useState('General');
  const [companyName, setCompanyName] = useState('Team Task Manager');
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('(UTC+05:30) Asia/Kolkata');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [taskAssigned, setTaskAssigned] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = ['General', 'Notifications', 'Security', 'Appearance'];

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure your workspace preferences.</p>
      </div>

      <div className="panel">
        <div className="settings-tabs">
          {tabs.map(t => (
            <button key={t} className={`settings-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {tab === 'General' && (
          <div className="form-grid">
            <div className="panel-title" style={{ marginBottom: 4 }}>General Settings</div>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input className="form-input" value={companyName} onChange={e => setCompanyName(e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Language</label>
                <select className="form-select" value={language} onChange={e => setLanguage(e.target.value)}>
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date Format</label>
                <select className="form-select" value={dateFormat} onChange={e => setDateFormat(e.target.value)}>
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Timezone</label>
              <select className="form-select" value={timezone} onChange={e => setTimezone(e.target.value)}>
                <option>(UTC+05:30) Asia/Kolkata</option>
                <option>(UTC+00:00) UTC</option>
                <option>(UTC-05:00) Eastern Time</option>
                <option>(UTC-08:00) Pacific Time</option>
                <option>(UTC+01:00) Europe/London</option>
              </select>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 4 }}>
              <div className="panel-title" style={{ marginBottom: 12 }}>Other Preferences</div>
              <div className="toggle-wrap"><span className="toggle-label">Enable Dark Mode</span><Toggle on={darkMode} onToggle={() => setDarkMode(v => !v)} /></div>
              <div className="toggle-wrap"><span className="toggle-label">Compact View</span><Toggle on={compactView} onToggle={() => setCompactView(v => !v)} /></div>
              <div className="toggle-wrap"><span className="toggle-label">Show Completed Tasks</span><Toggle on={showCompleted} onToggle={() => setShowCompleted(v => !v)} /></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={handleSave}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
            </div>
          </div>
        )}

        {tab === 'Notifications' && (
          <div className="form-grid">
            <div className="panel-title" style={{ marginBottom: 4 }}>Notification Settings</div>
            <div className="toggle-wrap"><span className="toggle-label">Email Notifications</span><Toggle on={emailNotifs} onToggle={() => setEmailNotifs(v => !v)} /></div>
            <div className="toggle-wrap"><span className="toggle-label">Push Notifications</span><Toggle on={pushNotifs} onToggle={() => setPushNotifs(v => !v)} /></div>
            <div className="toggle-wrap"><span className="toggle-label">Task Assigned to Me</span><Toggle on={taskAssigned} onToggle={() => setTaskAssigned(v => !v)} /></div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="btn btn-primary" onClick={handleSave}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
            </div>
          </div>
        )}

        {tab === 'Security' && (
          <div className="form-grid">
            <div className="panel-title" style={{ marginBottom: 4 }}>Security Settings</div>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" className="form-input" placeholder="••••••••••" />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="form-input" placeholder="••••••••••" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="form-input" placeholder="••••••••••" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary">Update Password</button>
            </div>
          </div>
        )}

        {tab === 'Appearance' && (
          <div className="form-grid">
            <div className="panel-title" style={{ marginBottom: 4 }}>Appearance</div>
            <div className="toggle-wrap"><span className="toggle-label">Dark Mode</span><Toggle on={darkMode} onToggle={() => setDarkMode(v => !v)} /></div>
            <div className="toggle-wrap"><span className="toggle-label">Compact View</span><Toggle on={compactView} onToggle={() => setCompactView(v => !v)} /></div>
            <div style={{ marginTop: 16 }}>
              <div className="form-label" style={{ marginBottom: 10 }}>Accent Color</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {['#5b6cff','#20c997','#f59e0b','#ef4444','#26c0ff','#7c3aed'].map(c => (
                  <div key={c} style={{ width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer', border: c === '#5b6cff' ? '3px solid var(--text)' : 'none' }} />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="btn btn-primary" onClick={handleSave}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Settings;
