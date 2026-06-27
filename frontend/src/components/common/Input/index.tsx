import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  style,
  id,
  ...props
}) => {
  const inputId = id || crypto.randomUUID();

  return (
    <div className="form-group" style={{ width: '100%' }}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <div
            style={{
              position: 'absolute',
              left: '14px',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text-tertiary)',
              pointerEvents: 'none'
            }}
          >
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className="form-input"
          style={{
            paddingLeft: icon ? '44px' : '16px',
            borderColor: error ? 'var(--error)' : 'var(--border-color)',
            ...style
          }}
          {...props}
        />
      </div>
      {error && (
        <span
          style={{
            display: 'block',
            fontSize: '0.75rem',
            color: 'var(--error)',
            marginTop: '4px',
            fontWeight: 500
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};
