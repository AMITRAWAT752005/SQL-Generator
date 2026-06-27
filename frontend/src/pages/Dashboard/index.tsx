import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDatabase } from '../../hooks/useDatabase';
import { useChat } from '../../hooks/useChat';
import { historyService } from '../../services/history.service';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  Activity,
  Database,
  MessageSquare,
  Play,
  History,
  Sparkles,
  Zap,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { connections, activeConnection } = useDatabase();
  const { messages } = useChat();
  const history = historyService.getHistory();

  const recentQueries = history.slice(0, 3);
  const connectedCount = connections.length;
  const totalQueries = history.length;
  const assistantQueries = messages.filter((m) => m.sender === 'assistant' && m.sql).length;
  const activeStatus = activeConnection ? 'Connected' : 'No connection';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '18px' }}>
        <div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Welcome back,</p>
          <h1 style={{ margin: '8px 0 0', fontSize: '2.25rem', fontWeight: 800 }}>Good to see you, {user?.name || 'AI Developer'}.</h1>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Button variant="accent" size="md" style={{ minWidth: '160px' }}>
            New AI Session
          </Button>
          <Link to="/assistant">
            <Button variant="secondary" size="md" style={{ minWidth: '160px' }}>
              Open Assistant
            </Button>
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px' }}>
        <Card title="Active Database" subtitle={activeStatus} action={activeConnection ? <Badge variant="success">Live</Badge> : <Badge variant="warning">Setup needed</Badge>}>
          {activeConnection ? (
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Connection</p>
                  <p style={{ margin: '6px 0 0', fontWeight: 700 }}>{activeConnection.name}</p>
                </div>
                <div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Type</p>
                  <p style={{ margin: '6px 0 0', fontWeight: 700 }}>{activeConnection.type}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Database</p>
                  <p style={{ margin: '6px 0 0', fontWeight: 700 }}>{activeConnection.database}</p>
                </div>
                <div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Host</p>
                  <p style={{ margin: '6px 0 0', fontWeight: 700 }}>{activeConnection.host}</p>
                </div>
              </div>
              <Link to="/database">
                <Button variant="secondary" size="sm" style={{ width: '100%' }}>
                  Manage Connections
                </Button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                You currently have no active database connection. Connect one to start generating SQL queries and running analysis from the assistant.
              </p>
              <Link to="/database">
                <Button variant="accent" size="sm" style={{ width: '100%' }}>
                  Connect Database
                </Button>
              </Link>
            </div>
          )}
        </Card>

        <Card title="Quick Stats" subtitle="Your current workspace metrics">
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Connected Databases</p>
                <p style={{ margin: '6px 0 0', fontWeight: 700, fontSize: '1.15rem' }}>{connectedCount}</p>
              </div>
              <Database size={28} style={{ color: 'var(--primary)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Generated Queries</p>
                <p style={{ margin: '6px 0 0', fontWeight: 700, fontSize: '1.15rem' }}>{totalQueries}</p>
              </div>
              <Zap size={28} style={{ color: 'var(--accent)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>AI Responses</p>
                <p style={{ margin: '6px 0 0', fontWeight: 700, fontSize: '1.15rem' }}>{assistantQueries}</p>
              </div>
              <MessageSquare size={28} style={{ color: 'var(--primary)' }} />
            </div>
          </div>
        </Card>

        <Card title="Launchpad" subtitle="Jump into your core workflows">
          <div style={{ display: 'grid', gap: '12px' }}>
            <Link to="/assistant">
              <Button size="md" variant="primary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <Sparkles size={18} /> Open AI Assistant
              </Button>
            </Link>
            <Link to="/playground">
              <Button size="md" variant="secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <Play size={18} /> Open SQL Playground
              </Button>
            </Link>
            <Link to="/history">
              <Button size="md" variant="secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <History size={18} /> View Query History
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '18px' }}>
        <Card title="Recent SQL History" subtitle="Quick access to the last generated queries" action={<Link to="/history"><Button variant="secondary" size="sm">View all</Button></Link>}>
          {recentQueries.length > 0 ? (
            <div style={{ display: 'grid', gap: '16px' }}>
              {recentQueries.map((item) => (
                <div key={item.id} style={{ padding: '18px', borderRadius: '14px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{item.dbName}</p>
                      <h4 style={{ margin: '8px 0 0', fontSize: '1rem', fontWeight: 700 }}>{item.naturalQuery}</h4>
                    </div>
                    <Badge variant={item.isSaved ? 'success' : 'secondary'}>{item.isSaved ? 'Saved' : 'Recent'}</Badge>
                  </div>
                  <p style={{ margin: '14px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.generatedSql}</p>
                  <div style={{ marginTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Executed in {item.executionTime}ms</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              No history items available yet. Generate SQL from the AI assistant to populate your recent queries.
            </p>
          )}
        </Card>

        <Card title="Your Workspace" subtitle="What’s next" action={<Link to="/profile"><Button variant="secondary" size="sm">Manage profile</Button></Link>}>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Activity size={18} style={{ color: 'var(--primary)' }} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Personalized workspace with active database insights.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={18} style={{ color: 'var(--success)' }} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Secure local mock data and session persistence.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <TrendingUp size={18} style={{ color: 'var(--accent)' }} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Switch databases quickly from the top navbar.</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
