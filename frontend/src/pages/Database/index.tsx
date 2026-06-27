import React, { useMemo, useState } from 'react';
import { useDatabase } from '../../hooks/useDatabase';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Database as DatabaseIcon, PlusCircle, Trash2, CheckCircle2, Activity, ServerCog, ShieldCheck } from 'lucide-react';

const Database: React.FC = () => {
  const {
    connections,
    activeConnection,
    isLoading,
    setActiveConnection,
    addConnection,
    removeConnection,
    testConnection,
  } = useDatabase();

  const [name, setName] = useState('New Database Connection');
  const [type, setType] = useState<'postgresql' | 'mysql' | 'sqlite' | 'mssql'>('postgresql');
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState(5432);
  const [database, setDatabase] = useState('example_db');
  const [username, setUsername] = useState('db_user');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const connectionCount = connections.length;
  const activeSchema = useMemo(() => activeConnection?.schema || [], [activeConnection]);

  const handleTestConnection = async () => {
    setStatusMessage(null);
    setErrorMessage(null);
    setIsTesting(true);

    try {
      const success = await testConnection(name, type, host, port, database, username);
      if (success) {
        setStatusMessage('Connection details look good. Ready to save.');
      }
    } catch (error: any) {
      setErrorMessage(error?.message || 'Connection test failed.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleAddConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const newConnection = await addConnection(name, type, host, port, database, username);
      setActiveConnection(newConnection);
      setStatusMessage('Connection saved and set as active.');
    } catch (error: any) {
      setErrorMessage(error?.message || 'Unable to save connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (id: string) => {
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      await removeConnection(id);
      setStatusMessage('Connection removed successfully.');
    } catch (error: any) {
      setErrorMessage(error?.message || 'Unable to remove connection.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Database Connections</p>
          <h1 style={{ margin: '8px 0 0', fontSize: '2.25rem', fontWeight: 800 }}>Manage your data sources</h1>
          <p style={{ margin: '12px 0 0', maxWidth: '640px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Add, test, and switch between database connections for the AI assistant and SQL playground.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant={activeConnection ? 'success' : 'warning'}>
            {activeConnection ? 'Active connection ready' : 'No active database'}
          </Badge>
          <Button variant="secondary" size="md" style={{ minWidth: '170px' }} onClick={() => setStatusMessage('You can add any mock database connection here.')}>
            <ServerCog size={16} /> Connection Help
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.3fr', gap: '22px' }}>
        <div style={{ display: 'grid', gap: '18px' }}>
          <Card title="Available Connections" subtitle="Switch between mock database environments" action={<Badge variant="primary">{connectionCount} total</Badge>}>
            {isLoading ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading connections...</p>
            ) : connections.length > 0 ? (
              <div style={{ display: 'grid', gap: '14px' }}>
                {connections.map((conn) => (
                  <div
                    key={conn.id}
                    style={{
                      padding: '16px',
                      borderRadius: '18px',
                      background: conn.id === activeConnection?.id ? 'rgba(56, 189, 248, 0.08)' : 'var(--bg-secondary)',
                      border: conn.id === activeConnection?.id ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      display: 'grid',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{conn.name}</h3>
                        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{conn.database} · {conn.type}</p>
                      </div>
                      <Badge variant={conn.id === activeConnection?.id ? 'success' : 'secondary'}>
                        {conn.id === activeConnection?.id ? 'Active' : 'Available'}
                      </Badge>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Host</p>
                        <p style={{ margin: '6px 0 0', fontWeight: 600 }}>{conn.host}:{conn.port}</p>
                      </div>
                      <div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>User</p>
                        <p style={{ margin: '6px 0 0', fontWeight: 600 }}>{conn.username}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <Button
                        variant={conn.id === activeConnection?.id ? 'accent' : 'primary'}
                        size="sm"
                        onClick={() => setActiveConnection(conn)}
                      >
                        {conn.id === activeConnection?.id ? 'Active' : 'Set Active'}
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleRemove(conn.id)}>
                        <Trash2 size={14} /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>
                No saved connections yet. Use the form on the right to add your first database.
              </p>
            )}
          </Card>

          <Card title="Active Connection Schema" subtitle="Preview the selected database model">
            {activeSchema.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)' }}>
                No active schema available. Select a connection or create one to see table structure.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {activeSchema.map((table) => (
                  <div key={table.tableName} style={{ padding: '14px', borderRadius: '14px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                      <div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Table</p>
                        <h4 style={{ margin: '8px 0 0', fontSize: '1rem', fontWeight: 700 }}>{table.tableName}</h4>
                      </div>
                      <Badge variant="secondary">{table.columns.length} cols</Badge>
                    </div>
                    <div style={{ marginTop: '12px', display: 'grid', gap: '8px' }}>
                      {table.columns.map((column) => (
                        <div key={column.name} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '0.85rem' }}>
                          <span>{column.name}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{column.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card title="Add a New Connection" subtitle="Use mock credentials to extend your workspace">
          <form onSubmit={handleAddConnection} style={{ display: 'grid', gap: '14px' }}>
            <Input label="Connection Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Type
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as typeof type)}
                  style={{ width: '100%', marginTop: '8px', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                >
                  <option value="postgresql">PostgreSQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="sqlite">SQLite</option>
                  <option value="mssql">SQL Server</option>
                </select>
              </label>
              <Input label="Host" value={host} onChange={(e) => setHost(e.target.value)} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input label="Port" type="number" value={port} onChange={(e) => setPort(Number(e.target.value))} required />
              <Input label="Database" value={database} onChange={(e) => setDatabase(e.target.value)} required />
            </div>
            <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />

            {(statusMessage || errorMessage) && (
              <div style={{ padding: '14px', borderRadius: '14px', background: errorMessage ? 'var(--error-glow)' : 'var(--success-glow)', border: `1px solid ${errorMessage ? 'var(--error)' : 'var(--success)'}` }}>
                <p style={{ margin: 0, color: errorMessage ? 'var(--error)' : 'var(--success)', fontSize: '0.95rem' }}>
                  {errorMessage || statusMessage}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Button type="button" variant="secondary" size="md" onClick={handleTestConnection} disabled={isTesting || !name || !host || !database || !username}>
                <CheckCircle2 size={16} /> {isTesting ? 'Testing...' : 'Test Connection'}
              </Button>
              <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} disabled={isSubmitting || !name || !host || !database || !username}>
                <PlusCircle size={16} /> Add Connection
              </Button>
            </div>
          </form>

          <div style={{ marginTop: '20px', display: 'grid', gap: '10px', padding: '14px', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <DatabaseIcon size={18} style={{ color: 'var(--primary)' }} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                New connections are mock-backed and persist in your browser storage.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={18} style={{ color: 'var(--success)' }} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Use the assistant and playground with safe demo datasets without needing a real server.
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Database;
