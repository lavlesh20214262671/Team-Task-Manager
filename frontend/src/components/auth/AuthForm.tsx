import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

type AuthFormProps = { mode: 'login' | 'signup' };

const AuthForm = ({ mode }: AuthFormProps) => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    let result;
    if (mode === 'login') {
      result = await signIn(email, password);
    } else {
      result = await signUp(name, email, password);
    }
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-logo">
        <div className="auth-logo-icon">TT</div>
        <span className="auth-logo-name">Team Task Manager</span>
      </div>
      <h2 className="auth-title">{mode === 'login' ? 'Welcome Back!' : 'Create Account'}</h2>
      <p className="auth-sub">{mode === 'login' ? 'Sign in to your account' : 'Start managing tasks with your team'}</p>

      <form onSubmit={handleSubmit} className="form-grid">
        {mode === 'signup' && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label className="form-label">Password</label>
            {mode === 'login' && <a href="#" className="forgot-link">Forgot password?</a>}
          </div>
          <input className="form-input" type="password" placeholder="••••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <div style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 600 }}>{error}</div>}
        <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
          {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <div className="auth-footer">
        {mode === 'login'
          ? <>Don't have an account? <Link to="/signup">Sign up</Link></>
          : <>Already have an account? <Link to="/login">Sign in</Link></>}
      </div>
    </div>
  );
};

export default AuthForm;
