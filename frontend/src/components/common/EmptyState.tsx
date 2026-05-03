type EmptyStateProps = {
  title: string;
  description: string;
};

const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <div className="panel">
      <h3>{title}</h3>
      <p style={{ color: 'var(--text-muted)' }}>{description}</p>
    </div>
  );
};

export default EmptyState;
