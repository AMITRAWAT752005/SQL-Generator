import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  style?: React.CSSProperties;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  style
}) => {
  const [active, setActive] = useState(false);

  const getPositionStyle = (): React.CSSProperties => {
    switch (position) {
      case 'bottom':
        return {
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%) translateY(8px)',
        };
      case 'left':
        return {
          top: '50%',
          right: '100%',
          transform: 'translateY(-50%) translateX(-8px)',
        };
      case 'right':
        return {
          top: '50%',
          left: '100%',
          transform: 'translateY(-50%) translateX(8px)',
        };
      case 'top':
      default:
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-8px)',
        };
    }
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', ...style }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {children}
      {active && (
        <div
          className="glass animate-fade"
          style={{
            position: 'absolute',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 500,
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow)',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            pointerEvents: 'none',
            ...getPositionStyle(),
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};
