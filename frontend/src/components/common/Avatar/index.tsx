import React from 'react';

interface AvatarProps {
  name: string;
  size?: number;
  src?: string;
  style?: React.CSSProperties;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 40,
  src,
  style
}) => {
  const getInitials = (n: string) => {
    const parts = n.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: `${size * 0.4}px`,
    color: '#ffffff',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
    boxShadow: '0 4px 10px var(--primary-glow)',
    overflow: 'hidden',
    userSelect: 'none',
    fontFamily: 'var(--font-heading)',
    ...style
  };

  if (src) {
    return (
      <div style={containerStyle}>
        <img
          src={src}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  return <div style={containerStyle}>{getInitials(name)}</div>;
};
