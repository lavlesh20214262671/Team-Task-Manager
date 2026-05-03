type Props = { todo: number; inProgress: number; done: number; total: number };

const TaskChart = ({ todo, inProgress, done, total }: Props) => {
  const safeTotal = total || 1;
  const doneDeg = (done / safeTotal) * 360;
  const progDeg = (inProgress / safeTotal) * 360;
  const doneEnd = doneDeg;
  const progEnd = doneDeg + progDeg;

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <span className="panel-title">Tasks Overview</span>
      </div>
      <div className="donut-wrap">
        <div
          className="donut"
          style={{
            background: `conic-gradient(
              #20c997 0deg ${doneEnd}deg,
              #5b6cff ${doneEnd}deg ${progEnd}deg,
              #c9cedd ${progEnd}deg 360deg
            )`
          }}
        />
        <div className="legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#20c997' }} />
            <span className="legend-label">Completed</span>
            <span className="legend-count">{done} ({total ? Math.round(done/total*100) : 0}%)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#5b6cff' }} />
            <span className="legend-label">In Progress</span>
            <span className="legend-count">{inProgress} ({total ? Math.round(inProgress/total*100) : 0}%)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#c9cedd' }} />
            <span className="legend-label">To Do</span>
            <span className="legend-count">{todo} ({total ? Math.round(todo/total*100) : 0}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskChart;
