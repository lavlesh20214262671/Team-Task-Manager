import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { login as apiLogin, signup as apiSignup } from '../api/authApi';

type User = { id: number; name: string; email: string };

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ttm_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await apiLogin({ email, password });
      if (res?.data?.user && res?.data?.accessToken) {
        const u = res.data.user;
        setUser(u);
        localStorage.setItem('ttm_user', JSON.stringify(u));
        localStorage.setItem('ttm_token', res.data.accessToken);
        return {};
      }
      return { error: res?.message || 'Invalid credentials' };
    } catch {
      return { error: 'Login failed' };
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const res = await apiSignup({ name, email, password });
      if (res?.data?.user && res?.data?.accessToken) {
        const u = res.data.user;
        setUser(u);
        localStorage.setItem('ttm_user', JSON.stringify(u));
        localStorage.setItem('ttm_token', res.data.accessToken);
        return {};
      }
      return { error: res?.message || 'Signup failed' };
    } catch {
      return { error: 'Signup failed' };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('ttm_user');
    localStorage.removeItem('ttm_token');
  };

  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), loading, signIn, signUp, signOut }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
