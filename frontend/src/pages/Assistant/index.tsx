import React, { useMemo, useRef, useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { useDatabase } from '../../hooks/useDatabase';
import { Button } from '../../components/common/Button';
import { ChatBubble } from '../../components/common/ChatBubble';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { ArrowRight, Send, Database, Sparkles } from 'lucide-react';

const Assistant: React.FC = () => {
  const { messages, isGenerating, sendMessage, executeMessageQuery, explainMessageQuery, optimizeMessageQuery, clearChat } = useChat();
  const { activeConnection } = useDatabase();
  const [prompt, setPrompt] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const assistantMessages = useMemo(
    () => messages.filter((message) => message.sender === 'assistant'),
    [messages]
  );

  const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    await sendMessage(prompt.trim());
    setPrompt('');
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Core AI Workflow</p>
          <h1 style={{ margin: '8px 0 0', fontSize: '2.25rem', fontWeight: 800 }}>AI Assistant</h1>
          <p style={{ margin: '12px 0 0', color: 'var(--text-secondary)', maxWidth: '640px', lineHeight: 1.7 }}>
            Ask the database directly and get production-ready SQL with explanation and execution actions.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="secondary" size="md" onClick={clearChat}>
            Clear Conversation
          </Button>
          <Button variant="accent" size="md" style={{ cursor: activeConnection ? 'pointer' : 'not-allowed' }} disabled={!activeConnection}>
            Connect a DB
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '22px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Active Database</span>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700 }}>{activeConnection ? activeConnection.name : 'No active connection'}</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                {activeConnection ? `${activeConnection.database} • ${activeConnection.type}` : 'Please connect a database to generate tailored SQL.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '14px 18px', borderRadius: '18px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <Database size={18} style={{ color: 'var(--primary)' }} />
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{activeConnection ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', minHeight: '520px', overflowY: 'auto', padding: '18px', borderRadius: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                sender={message.sender}
                text={message.text}
                sql={message.sql}
                explanation={message.explanation}
                statusUpdates={message.statusUpdates}
                isStreaming={message.isStreaming}
                executionResult={message.executionResult}
                executionError={message.executionError}
                onExecute={message.sql ? () => executeMessageQuery(message.id, message.sql!) : undefined}
                onExplain={message.sql ? () => explainMessageQuery(message.id, message.sql!) : undefined}
                onOptimize={message.sql ? () => optimizeMessageQuery(message.id, message.sql!) : undefined}
                onCopy={message.sql ? () => navigator.clipboard.writeText(message.sql!) : undefined}
              />
            ))}
            <div ref={chatEndRef} />
          </div>

          <Card title="Ask the Assistant" subtitle="Type a natural language request to generate SQL." action={<span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Streaming Responses</span>}>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
              <Input
                placeholder="e.g. Show top 10 customers by revenue"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                style={{ minHeight: '72px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <Button type="submit" size="lg" style={{ flex: 1 }} disabled={isGenerating || !activeConnection}>
                  {isGenerating ? 'Generating...' : 'Send Request'} <Send size={16} />
                </Button>
                <Button variant="secondary" size="lg" style={{ flex: 0.7 }} disabled={!activeConnection}>
                  Advanced Options
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <Card title="AI Tips" subtitle="Write better prompts with these examples.">
            <ul style={{ display: 'grid', gap: '12px', paddingLeft: '18px', color: 'var(--text-secondary)' }}>
              {[
                'Find low stock products under 20 units.',
                'Show students with GPA above 3.5.',
                'List orders placed last month by status.',
                'Generate SQL for products priced above $100.'
              ].map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </Card>

          <Card title="Assistant Actions" subtitle="Quick actions for generated SQL.">
            <div style={{ display: 'grid', gap: '12px' }}>
              <Button variant="secondary" size="md" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <Sparkles size={18} /> Optimize SQL
              </Button>
              <Button variant="secondary" size="md" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <ArrowRight size={18} /> Explain SQL
              </Button>
              <Button variant="secondary" size="md" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <Database size={18} /> Validate Query
              </Button>
            </div>
          </Card>

          <Card title="Conversation Status" subtitle="Latest AI interaction details.">
            <div style={{ display: 'grid', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Messages</span>
                <strong>{messages.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Cached Responses</span>
                <strong>{assistantMessages.length}</strong>
              </div>
              {lastAssistantMessage && lastAssistantMessage.sql && (
                <div style={{ borderRadius: '14px', background: 'var(--bg-primary)', padding: '14px', border: '1px solid var(--border-color)' }}>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Last generated SQL was created at:</p>
                  <strong style={{ display: 'block', marginTop: '10px' }}>{new Date(lastAssistantMessage.timestamp).toLocaleString()}</strong>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
