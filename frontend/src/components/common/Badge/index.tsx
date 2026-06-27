import React from 'react';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  style
}) => {
  const getStyles = (): React.CSSProperties => {
    let background = 'var(--primary-glow)';
    let color = 'var(--primary)';
    let border = '1px solid var(--primary)';

    if (variant === 'secondary') {
      background = 'var(--bg-tertiary)';
      color = 'var(--text-secondary)';
      border = '1px solid var(--border-color)';
    } else if (variant === 'accent') {
      background = 'var(--accent-glow)';
      color = 'var(--accent)';
      border = '1px solid var(--accent)';
    } else if (variant === 'success') {
      background = 'var(--success-glow)';
      color = 'var(--success)';
      border = '1px solid var(--success)';
    } else if (variant === 'warning') {
      background = 'var(--warning-glow)';
      color = 'var(--warning)';
      border = '1px solid var(--warning)';
    } else if (variant === 'danger') {
      background = 'var(--error-glow)';
      color = 'var(--error)';
      border = '1px solid var(--error)';
    }

    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: '6px',
      fontSize: '0.75rem',
      fontWeight: 600,
      background,
      color,
      border,
      fontFamily: 'var(--font-heading)',
      ...style
    };
  };

  return <span style={getStyles()}>{children}</span>;
};
