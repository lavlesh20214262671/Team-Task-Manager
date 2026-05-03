import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

const EVENTS: Record<string, { label: string; color: string; bg: string }[]> = {
  '2026-05-01': [{ label: 'Project Meeting 10:00 AM', color: '#20c997', bg: '#e7fbf4' }],
  '2026-05-05': [{ label: 'Design Review 11:00 AM', color: '#26c0ff', bg: '#e8f8ff' }],
  '2026-05-07': [{ label: 'Sprint Planning 09:30 AM', color: '#f59e0b', bg: '#fff8e7' }],
  '2026-05-13': [],
  '2026-05-15': [{ label: 'Progress Update 10:30 AM', color: '#20c997', bg: '#e7fbf4' }],
  '2026-05-20': [{ label: 'Deadline - Website Redesign', color: '#ef4444', bg: '#fef2f2' }],
  '2026-05-23': [{ label: 'Team Retrospective 03:00 PM', color: '#26c0ff', bg: '#e8f8ff' }],
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const Calendar = () => {
  const today = new Date();
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(4); // May (0-indexed)
  const [view, setView] = useState<'Month'|'Week'|'Day'>('Month');

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: { date: number; month: 'prev' | 'current' | 'next'; key: string }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const m = month - 1 < 0 ? 11 : month - 1;
    const y = month - 1 < 0 ? year - 1 : year;
    cells.push({ date: d, month: 'prev', key: `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: d, month: 'current', key: `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}` });
  }
  let next = 1;
  while (cells.length < 42) {
    const m = month + 1 > 11 ? 0 : month + 1;
    const y = month + 1 > 11 ? year + 1 : year;
    cells.push({ date: next, month: 'next', key: `${y}-${String(m+1).padStart(2,'0')}-${String(next).padStart(2,'0')}` });
    next++;
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Calendar</h1>
            <p className="page-subtitle">Stay ahead of deadlines and key events.</p>
          </div>
          <button className="btn btn-primary">+ Event</button>
        </div>
      </div>

      <div className="panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div className="cal-nav">
            <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
            <button className="cal-nav-btn" onClick={nextMonth}>›</button>
            <button className="cal-month-btn">{MONTHS[month]} {year} <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>▾</span></button>
            <button className="btn btn-secondary btn-sm" onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); }}>Today</button>
          </div>
          <div className="cal-view-btns">
            {(['Month','Week','Day'] as const).map(v => (
              <button key={v} className={`cal-view-btn${view === v ? ' active' : ''}`} onClick={() => setView(v)}>{v}</button>
            ))}
          </div>
        </div>

        <div className="calendar-grid">
          {DAYS.map(d => <div key={d} className="cal-header-cell">{d}</div>)}
          {cells.map(cell => (
            <div key={cell.key} className={`cal-cell${cell.month !== 'current' ? ' other-month' : ''}${cell.key === todayStr ? ' today' : ''}`}>
              <div className="cal-day" style={{ opacity: cell.month !== 'current' ? 0.4 : 1 }}>{cell.date}</div>
              {(EVENTS[cell.key] || []).map((ev, i) => (
                <div key={i} className="cal-event" style={{ background: ev.bg, color: ev.color }}>{ev.label}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
