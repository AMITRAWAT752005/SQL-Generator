import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  style
}) => {
  return (
    <div
      className="card animate-fade flex-center"
      style={{
        flexDirection: 'column',
        padding: '48px 32px',
        textAlign: 'center',
        background: 'var(--bg-secondary)',
        border: '1px dashed var(--border-color)',
        borderRadius: '12px',
        maxWidth: '480px',
        margin: '24px auto',
        ...style
      }}
    >
      {icon && (
        <div
          style={{
            fontSize: '2.5rem',
            color: 'var(--text-tertiary)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </div>
      )}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
        {title}
      </h3>
      <p
        style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.5',
          marginBottom: '20px',
          maxWidth: '360px'
        }}
      >
        {description}
      </p>
      {action && <div style={{ display: 'flex', justifyContent: 'center' }}>{action}</div>}
    </div>
  );
};
