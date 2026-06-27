import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  style?: React.CSSProperties;
}

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; style?: React.CSSProperties }> = ({
  size = 'md',
  style
}) => {
  const dimension = size === 'sm' ? 16 : size === 'lg' ? 48 : 28;
  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 38 38"
      stroke="var(--primary)"
      style={{
        animation: 'spin 1s linear infinite',
        ...style
      }}
    >
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="2.5">
          <circle strokeOpacity=".2" cx="18" cy="18" r="18" />
          <path d="M36 18c0-9.94-8.06-18-18-18" />
        </g>
      </g>
    </svg>
  );
};

export const ThinkingLoader: React.FC<{ message: string; style?: React.CSSProperties }> = ({
  message,
  style
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '10px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        width: 'fit-content',
        boxShadow: 'var(--shadow)',
        ...style
      }}
    >
      <Spinner size="sm" />
      <span
        style={{
          fontSize: '0.85rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)'
        }}
      >
        {message}
      </span>
    </div>
  );
};

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  text,
  style
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '24px',
        ...style
      }}
    >
      <Spinner size={size} />
      {text && (
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {text}
        </span>
      )}
    </div>
  );
};
