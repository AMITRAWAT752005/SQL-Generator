import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Database, ToggleLeft } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (isLoading) {
    return (
      <div className="page-container flex-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div
      className="page-container animate-fade flex-center"
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: 'var(--bg-primary)',
        padding: '20px',
      }}
    >
      {/* Decorative Neon Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
        }}
      />

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="glass"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '8px 12px',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10
        }}
      >
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </button>

      {/* Main card */}
      <div
        className="glass animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '440px',
          borderRadius: '16px',
          padding: '40px 32px',
          boxShadow: 'var(--shadow)',
          zIndex: 2,
          position: 'relative',
        }}
      >
        {/* Logo */}
        <div className="flex-center" style={{ flexDirection: 'column', marginBottom: '32px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px var(--primary-glow)',
              marginBottom: '16px',
            }}
          >
            <Database size={24} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            SQL Copilot
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Conversational Database Assistant
          </p>
        </div>

        <Outlet />
      </div>
    </div>
  );
};
