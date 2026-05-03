import { useNavigate } from 'react-router-dom';

type Task = { id: number; title: string; project?: string; dueDate?: string | null };

const getDueLabel = (dueDate?: string | null) => {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  const now = new Date();
  const diffDays = Math.ceil((due.getTime() - now.setHours(0,0,0,0)) / 86400000);
  if (diffDays === 0) return { label: 'Today', cls: 'due-today' };
  if (diffDays === 1) return { label: 'Tomorrow', cls: 'due-tomorrow' };
  if (diffDays > 0) return { label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), cls: 'due-soon' };
  return { label: 'Overdue', cls: 'due-today' };
};

const DEMO_TASKS: Task[] = [
  { id: 1, title: 'Design login page', project: 'Website Redesign', dueDate: new Date().toISOString() },
  { id: 2, title: 'API integration', project: 'Mobile App', dueDate: new Date(Date.now()+86400000).toISOString() },
  { id: 3, title: 'Database optimization', project: 'Backend Service', dueDate: new Date(Date.now()+2*86400000).toISOString() },
  { id: 4, title: 'User testing', project: 'Mobile App', dueDate: new Date(Date.now()+4*86400000).toISOString() },
];

const RecentTasks = ({ tasks }: { tasks?: Task[] }) => {
  const navigate = useNavigate();
  const displayTasks = (tasks && tasks.length > 0) ? tasks.slice(0, 5) : DEMO_TASKS;

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <span className="panel-title">Upcoming Tasks</span>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/tasks')}>View all</button>
      </div>
      <div className="task-list">
        {displayTasks.map(task => {
          const due = getDueLabel(task.dueDate);
          return (
            <div key={task.id} className="task-item">
              <div className="task-item-left">
                <div className="task-check" />
                <div>
                  <div className="task-name">{task.title}</div>
                  <div className="task-proj">{task.project}</div>
                </div>
              </div>
              {due && <span className={`due-tag ${due.cls}`}>{due.label}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentTasks;
