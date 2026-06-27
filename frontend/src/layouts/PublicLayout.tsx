import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Database, Menu } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const PublicLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="page-container" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header
        className="glass animate-fade"
        style={{
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 8px var(--primary-glow)',
            }}
          >
            <Database size={16} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            SQL Copilot
          </span>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a
            href="#features"
            style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Features
          </a>
          <a
            href="#workflow"
            style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Workflow
          </a>
          <a
            href="#stack"
            style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Technology Stack
          </a>
        </nav>

        {/* CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="glass"
            style={{
              border: '1px solid var(--border-color)',
              background: 'transparent',
              borderRadius: '8px',
              padding: '6px 12px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'var(--primary)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px var(--primary-glow)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--primary-hover)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <Link
                to="/login"
                style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}
              >
                Sign In
              </Link>
              <button
                onClick={() => navigate('/register')}
                style={{
                  background: 'var(--primary)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px var(--primary-glow)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary-hover)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Get Started Free
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main content body */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)',
          padding: '40px 0',
          textAlign: 'center',
          color: 'var(--text-tertiary)',
          fontSize: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '16px' }}>
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <a href="#stack">Stack</a>
        </div>
        <p>&copy; {new Date().getFullYear()} SQL Copilot AI. All rights reserved.</p>
      </footer>
    </div>
  );
};
