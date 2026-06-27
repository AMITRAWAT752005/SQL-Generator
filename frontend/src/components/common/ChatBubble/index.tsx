import React from 'react';
import { QueryResult } from '../../../services/query.service';
import { Button } from '../Button';
import { ResultTable } from '../ResultTable';
import { Copy, Play, Sparkles, BookOpen, MessageSquare } from 'lucide-react';

interface ChatBubbleProps {
  sender: 'user' | 'assistant';
  text: string;
  sql?: string;
  explanation?: string;
  statusUpdates?: string[];
  isStreaming?: boolean;
  executionResult?: QueryResult;
  executionError?: string;
  onExecute?: () => void;
  onExplain?: () => void;
  onOptimize?: () => void;
  onCopy?: () => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  sender,
  text,
  sql,
  explanation,
  statusUpdates,
  isStreaming,
  executionResult,
  executionError,
  onExecute,
  onExplain,
  onOptimize,
  onCopy,
}) => {
  const isAssistant = sender === 'assistant';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isAssistant ? 'flex-start' : 'flex-end',
        gap: '12px',
      }}
    >
      <div
        style={{
          maxWidth: '100%',
          minWidth: '220px',
          width: '100%',
          background: isAssistant ? 'var(--bg-secondary)' : 'var(--primary)',
          color: isAssistant ? 'var(--text-primary)' : '#fff',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '18px',
          boxShadow: 'var(--shadow)',
        }}
      >
        <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{text}</p>

        {statusUpdates && statusUpdates.length > 0 && (
          <div style={{ marginTop: '14px', display: 'grid', gap: '8px' }}>
            {statusUpdates.map((update, index) => (
              <span key={index} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                • {update}
              </span>
            ))}
          </div>
        )}

        {sql && (
          <div style={{ marginTop: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Generated SQL</strong>
              {onCopy && (
                <Button variant="ghost" size="sm" style={{ padding: '8px 12px' }} onClick={onCopy}>
                  <Copy size={16} /> Copy
                </Button>
              )}
            </div>
            <pre className="code-block" style={{ margin: 0 }}>{sql}</pre>
          </div>
        )}

        {explanation && (
          <div style={{ marginTop: '18px', padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}><strong>Explanation:</strong> {explanation}</p>
          </div>
        )}

        {executionError && (
          <div style={{ marginTop: '18px', padding: '14px', borderRadius: '14px', background: 'var(--error-glow)', border: '1px solid var(--error)' }}>
            <p style={{ margin: 0, color: 'var(--error)', fontSize: '0.9rem' }}>{executionError}</p>
          </div>
        )}

        {executionResult && (
          <div style={{ marginTop: '18px' }}>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Result</p>
                <p style={{ margin: '4px 0 0', fontWeight: 700, fontSize: '0.95rem' }}>{executionResult.rowCount} rows • {executionResult.executionTime} ms</p>
              </div>
            </div>
            <ResultTable result={executionResult} />
          </div>
        )}
      </div>

      {isAssistant && (onExecute || onExplain || onOptimize) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {onExecute && (
            <Button variant="secondary" size="sm" onClick={onExecute}>
              <Play size={14} /> Execute Query
            </Button>
          )}
          {onExplain && (
            <Button variant="secondary" size="sm" onClick={onExplain}>
              <BookOpen size={14} /> Explain SQL
            </Button>
          )}
          {onOptimize && (
            <Button variant="secondary" size="sm" onClick={onOptimize}>
              <Sparkles size={14} /> Optimize Query
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
