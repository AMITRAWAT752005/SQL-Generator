import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Mail, Lock, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (otp !== '123456') {
      setError('Invalid security code. (Use code: 123456)');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await resetPassword(email, newPassword);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--success)', marginBottom: '16px' }}>
          <CheckCircle2 size={48} style={{ filter: 'drop-shadow(0 0 10px var(--success-glow))' }} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>
          Password Reset Complete
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '28px' }}>
          Your security credentials have been updated. You can now log in using your new password.
        </p>
        <Button size="lg" style={{ width: '100%' }} onClick={() => navigate('/login')}>
          Proceed to Login
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>
        Reset password
      </h3>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '24px', textAlign: 'center' }}>
        {step === 'email'
          ? 'Enter your account email, and we will send you a one-time validation code.'
          : `We have sent a security code to ${email}. (Use: 123456)`}
      </p>

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

      {step === 'email' ? (
        <form onSubmit={handleEmailSubmit}>
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={16} />}
            required
          />

          <Button type="submit" size="lg" style={{ width: '100%', marginTop: '8px' }} isLoading={isLoading}>
            Send Security Code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit}>
          <Input
            label="Security Code"
            type="text"
            placeholder="Enter 123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            icon={<KeyRound size={16} />}
            required
          />

          <Input
            label="New Password"
            type="password"
            placeholder="At least 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            icon={<Lock size={16} />}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock size={16} />}
            required
          />

          <Button type="submit" size="lg" style={{ width: '100%', marginTop: '12px' }} isLoading={isLoading}>
            Update Password
          </Button>
        </form>
      )}

      <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Remembered your password?{' '}
        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
