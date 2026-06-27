import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Mail, Lock, AlertCircle, Info } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Incorrect credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@sqlcopilot.ai');
    setPassword('password123');
    setError(null);
  };

  return (
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
        Sign in to your account
      </h3>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px',
            background: 'var(--error-glow)',
            border: '1px solid var(--error)',
            borderRadius: '8px',
            color: 'var(--error)',
            fontSize: '0.85rem',
            marginBottom: '20px',
            lineHeight: '1.4'
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={16} />}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={16} />}
          required
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.8rem' }} />
          <Link
            to="/forgot-password"
            style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" size="lg" style={{ width: '100%' }} isLoading={isLoading}>
          Sign In
        </Button>
      </form>

      {/* Demo Credentials Helper */}
      <div
        className="glass"
        style={{
          marginTop: '24px',
          padding: '12px 16px',
          borderRadius: '8px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)' }}>
          <Info size={14} />
          Demo Mode Sandbox
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          Use the registered sandbox account below to immediately view the interactive dashboard:
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
            admin@sqlcopilot.ai / password123
          </div>
          <button
            onClick={handleDemoFill}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Auto Fill
          </button>
        </div>
      </div>

      <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
