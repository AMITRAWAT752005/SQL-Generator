import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--primary)' }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '24px' }}>
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="glass"
        style={{
          padding: '10px 20px',
          borderRadius: '8px',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
        }}
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
