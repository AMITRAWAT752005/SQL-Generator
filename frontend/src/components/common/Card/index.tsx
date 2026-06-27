import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, action, children, className, style }) => {
  return (
    <section className={`card ${className || ''}`} style={{ ...style }}>
      {(title || subtitle || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '18px' }}>
          <div>
            {title && <h3 style={{ marginBottom: subtitle ? '6px' : 0, fontSize: '1.1rem', fontWeight: 700 }}>{title}</h3>}
            {subtitle && <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
};
