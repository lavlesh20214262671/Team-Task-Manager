import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 72, fontWeight: 800, color: 'var(--primary)' }}>404</div>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Page not found</div>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>The page you're looking for doesn't exist.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
      </div>
    </div>
  );
};

export default NotFound;
