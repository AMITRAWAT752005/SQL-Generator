import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDatabase } from '../hooks/useDatabase';
import { useTheme } from '../hooks/useTheme';
import {
  LayoutDashboard,
  MessageSquare,
  Play,
  Database,
  History,
  Bookmark,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  Bell,
  Menu,
  X
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { connections, activeConnection, setActiveConnection } = useDatabase();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDbDropdownOpen, setIsDbDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'AI Assistant', path: '/assistant', icon: <MessageSquare size={20} /> },
    { name: 'SQL Playground', path: '/playground', icon: <Play size={20} /> },
    { name: 'Databases', path: '/database', icon: <Database size={20} /> },
    { name: 'History', path: '/history', icon: <History size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const current = menuItems.find((item) => item.path === location.pathname);
    return current ? current.name : 'SQL Generator';
  };

  return (
    <div className="page-container" style={{ minHeight: '100vh', flexDirection: 'row', background: 'var(--bg-primary)' }}>
      {/* SIDEBAR FOR DESKTOP */}
      <aside
        className="glass"
        style={{
          width: 'var(--sidebar-width)',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border-color)',
          height: '100vh',
          position: 'sticky',
          top: 0,
          left: 0,
          zIndex: 10,
          transition: 'all 0.3s ease',
        }}
      >
        {/* Sidebar Brand Logo */}
        <div
          style={{
            height: 'var(--navbar-height)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0 24px',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
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

        {/* Sidebar Connections Status */}
        {activeConnection ? (
          <div
            style={{
              margin: '16px',
              padding: '12px',
              borderRadius: '8px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="glow-dot success" />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                CONNECTED DB
              </span>
            </div>
            <p
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                marginTop: '4px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {activeConnection.name}
            </p>
          </div>
        ) : (
          <div
            style={{
              margin: '16px',
              padding: '12px',
              borderRadius: '8px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--error-glow)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="glow-dot error" />
              <span style={{ fontSize: '0.75rem', color: 'var(--error)', fontWeight: 500 }}>
                NO CONNECTION
              </span>
            </div>
            <Link
              to="/database"
              style={{
                fontSize: '0.8rem',
                color: 'var(--primary)',
                textDecoration: 'underline',
                marginTop: '4px',
                display: 'block',
              }}
            >
              Connect Database
            </Link>
          </div>
        )}

        {/* Navigation Menu */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User logout section */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--error)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--error-glow)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN WRAPPER CONTAINER */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh' }}>
        {/* NAVBAR */}
        <header
          className="glass"
          style={{
            height: 'var(--navbar-height)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 9,
          }}
        >
          {/* Header Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
              {getPageTitle()}
            </h1>
          </div>

          {/* Right side operations */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Quick DB Switcher */}
            {connections.length > 0 && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsDbDropdownOpen(!isDbDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}
                >
                  <Database size={16} style={{ color: 'var(--primary)' }} />
                  {activeConnection ? activeConnection.database : 'Select DB'}
                  <ChevronDown size={14} />
                </button>

                {isDbDropdownOpen && (
                  <div
                    className="glass animate-slide-up"
                    style={{
                      position: 'absolute',
                      top: '110%',
                      right: 0,
                      width: '240px',
                      borderRadius: '8px',
                      padding: '6px',
                      boxShadow: 'var(--shadow)',
                      zIndex: 100,
                    }}
                  >
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '6px 8px 4px 8px', fontWeight: 600 }}>
                      SWITCH ACTIVE DATABASE
                    </p>
                    {connections.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveConnection(c);
                          setIsDbDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          background: activeConnection?.id === c.id ? 'var(--bg-tertiary)' : 'transparent',
                          color: 'var(--text-primary)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                        onMouseEnter={(e) => {
                          if (activeConnection?.id !== c.id) {
                            e.currentTarget.style.background = 'var(--bg-tertiary)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeConnection?.id !== c.id) {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                      >
                        <span className={`glow-dot ${activeConnection?.id === c.id ? 'success' : 'warning'}`} style={{ width: '6px', height: '6px' }} />
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                padding: '6px',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notification Indicator */}
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} style={{ color: 'var(--text-secondary)' }} />
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  boxShadow: '0 0 6px var(--accent)',
                }}
              />
            </div>

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                  }}
                >
                  {user ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </button>

              {isProfileDropdownOpen && (
                <div
                  className="glass animate-slide-up"
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    width: '180px',
                    borderRadius: '8px',
                    padding: '6px',
                    boxShadow: 'var(--shadow)',
                    zIndex: 100,
                  }}
                >
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      display: 'block',
                      color: 'var(--text-primary)',
                      border: 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      display: 'block',
                      color: 'var(--text-primary)',
                      border: 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    Settings
                  </Link>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      display: 'block',
                      color: 'var(--error)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--error-glow)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN PAGE CONTENT PANEL */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto', position: 'relative' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
