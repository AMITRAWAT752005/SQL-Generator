import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  glow = false,
  isLoading = false,
  icon,
  style,
  disabled,
  ...props
}) => {
  const getStyles = () => {
    let background = 'var(--primary)';
    let color = '#ffffff';
    let border = '1px solid transparent';
    let boxShadow = glow ? '0 0 15px var(--primary-glow)' : 'none';

    if (variant === 'secondary') {
      background = 'var(--bg-secondary)';
      color = 'var(--text-primary)';
      border = '1px solid var(--border-color)';
      boxShadow = glow ? '0 0 15px var(--border-color)' : 'none';
    } else if (variant === 'accent') {
      background = 'var(--accent)';
      color = 'hsl(240, 10%, 4%)';
      boxShadow = glow ? '0 0 15px var(--accent-glow)' : 'none';
    } else if (variant === 'danger') {
      background = 'var(--error)';
      color = '#ffffff';
      boxShadow = glow ? '0 0 15px var(--error-glow)' : 'none';
    } else if (variant === 'ghost') {
      background = 'transparent';
      color = 'var(--text-secondary)';
      border = '1px solid transparent';
    }

    const padding = size === 'sm' ? '6px 12px' : size === 'lg' ? '14px 28px' : '10px 20px';
    const fontSize = size === 'sm' ? '0.8rem' : size === 'lg' ? '1.05rem' : '0.9rem';
    const borderRadius = '10px';

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontFamily: 'var(--font-heading)',
      fontWeight: 600,
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      opacity: disabled || isLoading ? 0.6 : 1,
      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      outline: 'none',
      padding,
      fontSize,
      borderRadius,
      background,
      color,
      border,
      boxShadow,
      ...style,
    };
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    const btn = e.currentTarget;
    btn.style.transform = 'translateY(-1px)';
    
    if (variant === 'primary') {
      btn.style.background = 'var(--primary-hover)';
      btn.style.boxShadow = '0 0 20px var(--primary)';
    } else if (variant === 'secondary') {
      btn.style.background = 'var(--bg-tertiary)';
      btn.style.borderColor = 'var(--text-tertiary)';
    } else if (variant === 'accent') {
      btn.style.boxShadow = '0 0 20px var(--accent)';
    } else if (variant === 'danger') {
      btn.style.boxShadow = '0 0 20px var(--error)';
    } else if (variant === 'ghost') {
      btn.style.background = 'var(--bg-tertiary)';
      btn.style.color = 'var(--text-primary)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    btn.style.transform = 'translateY(0)';
    
    const orig = getStyles() as any;
    btn.style.background = orig.background;
    btn.style.borderColor = orig.border.split(' ')[2] || 'transparent';
    btn.style.color = orig.color;
    btn.style.boxShadow = orig.boxShadow;
  };

  return (
    <button
      disabled={disabled || isLoading}
      style={getStyles()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {isLoading && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 38 38"
          stroke="currentColor"
          style={{ animation: 'spin 1s linear infinite' }}
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(1 1)" strokeWidth="2">
              <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
              <path d="M36 18c0-9.94-8.06-18-18-18" />
            </g>
          </g>
        </svg>
      )}
      {!isLoading && icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
    </button>
  );
};
