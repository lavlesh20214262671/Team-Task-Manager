type StatCardProps = {
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
};

const StatCard = ({ title, value, subtitle, color, bgColor, icon }: StatCardProps) => (
  <div className="stat-card">
    <div className="stat-icon-wrap" style={{ background: bgColor }}>
      <span style={{ color }}>{icon}</span>
    </div>
    <div>
      <div className="stat-label">{title}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-sub" style={{ color }}>{subtitle}</div>
    </div>
  </div>
);

export default StatCard;
