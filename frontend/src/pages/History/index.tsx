import React, { useEffect, useState } from 'react';
import { historyService, HistoryItem } from '../../services/history.service';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Clock3, Trash2, Sparkles, Database as DatabaseIcon, FileText } from 'lucide-react';

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setHistory(historyService.getHistory());
  }, []);

  const refreshHistory = () => setHistory(historyService.getHistory());

  const handleToggleSave = (id: string) => {
    historyService.toggleSaveItem(id);
    refreshHistory();
  };

  const handleDelete = (id: string) => {
    historyService.deleteItem(id);
    refreshHistory();
    setMessage('History entry deleted successfully.');
  };

  const handleClear = () => {
    historyService.clearHistory();
    refreshHistory();
    setMessage('History cleared. Your recent executions are now empty.');
  };

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Query History</p>
          <h1 style={{ margin: '8px 0 0', fontSize: '2.25rem', fontWeight: 800 }}>Review your SQL activity</h1>
          <p style={{ margin: '12px 0 0', maxWidth: '680px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Explore saved queries, recent executions, and timeline details for the AI assistant and playground.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="secondary" size="md" onClick={refreshHistory}>
            <Clock3 size={16} /> Refresh
          </Button>
          <Button variant="danger" size="md" onClick={handleClear} disabled={history.length === 0}>
            <Trash2 size={16} /> Clear All
          </Button>
        </div>
      </div>

      {message && (
        <div style={{ padding: '16px', borderRadius: '16px', background: 'var(--success-glow)', border: '1px solid var(--success)', color: 'var(--success)' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '22px' }}>
        <Card title="History Feed" subtitle={`You have ${history.length} saved entries`}>
          {history.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              No query history is available yet. Run SQL in the playground or generate queries with the assistant to populate this list.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '18px' }}>
              {history.map((item) => (
                <div key={item.id} style={{ padding: '18px', borderRadius: '18px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <Badge variant={item.isSaved ? 'success' : 'secondary'}>{item.isSaved ? 'Saved' : 'Recent'}</Badge>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.dbName} · {item.dbType}</span>
                      </div>
                      <h3 style={{ margin: '10px 0 0', fontSize: '1.05rem', fontWeight: 700 }}>{item.naturalQuery}</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <Button variant="secondary" size="sm" onClick={() => handleToggleSave(item.id)}>
                        <Sparkles size={14} /> {item.isSaved ? 'Unsave' : 'Save'}
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 size={14} /> Delete
                      </Button>
                    </div>
                  </div>
                  <pre className="code-block" style={{ margin: '16px 0 0', padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', overflowX: 'auto' }}>
                    {item.generatedSql}
                  </pre>
                  <div style={{ marginTop: '14px', display: 'grid', gap: '8px' }}>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.explanation}</p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                      <span>{item.executionTime} ms</span>
                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Insights" subtitle="Quick metrics from your query history">
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <DatabaseIcon size={18} style={{ color: 'var(--primary)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Total executions: {history.length}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileText size={18} style={{ color: 'var(--accent)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Saved items: {history.filter((item) => item.isSaved).length}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Clock3 size={18} style={{ color: 'var(--success)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Latest activity: {history[0] ? new Date(history[0].createdAt).toLocaleString() : 'N/A'}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default History;
