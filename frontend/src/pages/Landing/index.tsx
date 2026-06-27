import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MessageSquare,
  Database,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  Layers,
  Code
} from 'lucide-react';
import { Button } from '../../components/common/Button';

interface TypewriterScenario {
  prompt: string;
  sql: string;
  explanation: string;
}

const SCENARIOS: TypewriterScenario[] = [
  {
    prompt: "Get top 5 customers who spent the most",
    sql: "SELECT u.username, SUM(o.total_amount) as total_spent\nFROM users u\nJOIN orders o ON u.id = o.user_id\nGROUP BY u.username\nORDER BY total_spent DESC\nLIMIT 5;",
    explanation: "Joins users and orders, aggregates transaction values, sorts descending, and limits the output."
  },
  {
    prompt: "Find students enrolled in DB class with grades above 3.6",
    sql: "SELECT s.first_name, s.last_name, e.grade\nFROM students s\nJOIN enrollments e ON s.id = e.student_id\nJOIN courses c ON e.course_id = c.id\nWHERE c.course_name = 'Database Management Systems'\n  AND e.grade > 3.6;",
    explanation: "Links students to enrollments, filters by DB course name, and limits grades to > 3.6."
  }
];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [typedPrompt, setTypedPrompt] = useState('');
  const [step, setStep] = useState<'typing' | 'loading' | 'sql' | 'done'>('typing');
  const [loadingText, setLoadingText] = useState('');

  // Typwriter effect
  useEffect(() => {
    let active = true;
    const currentScenario = SCENARIOS[scenarioIndex];
    let charIndex = 0;
    setStep('typing');
    setTypedPrompt('');

    const type = () => {
      if (!active) return;
      if (charIndex < currentScenario.prompt.length) {
        setTypedPrompt((prev) => prev + currentScenario.prompt[charIndex]);
        charIndex++;
        setTimeout(type, 60);
      } else {
        // Start loading simulation
        setTimeout(triggerLoading, 800);
      }
    };

    const triggerLoading = async () => {
      if (!active) return;
      setStep('loading');
      
      const loadingPhrases = [
        'Analyzing query intent...',
        'Reading connected database schema...',
        'Generating optimized SQL statement...',
        'Validating syntax...'
      ];

      for (let i = 0; i < loadingPhrases.length; i++) {
        if (!active) return;
        setLoadingText(loadingPhrases[i]);
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      setStep('sql');
      setTimeout(() => {
        if (active) setStep('done');
      }, 1500);
    };

    type();

    return () => {
      active = false;
    };
  }, [scenarioIndex]);

  // Cycle scenario index
  useEffect(() => {
    const interval = setInterval(() => {
      if (step === 'done') {
        setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [step]);

  return (
    <div style={{ background: 'var(--bg-primary)', overflow: 'hidden' }}>
      {/* 1. HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: '100px 20px 80px 20px',
          textAlign: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Floating gradient */}
        <div
          style={{
            position: 'absolute',
            top: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
            filter: 'blur(80px)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Small Badge */}
        <div
          className="glass"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--accent)',
            border: '1px solid var(--border-color)',
            marginBottom: '24px',
            zIndex: 2,
          }}
        >
          <Sparkles size={14} />
          AI-Powered Natural Language to SQL
        </div>

        {/* Hero Title */}
        <h1
          style={{
            fontSize: '3.75rem',
            lineHeight: '1.15',
            fontWeight: 800,
            maxWidth: '850px',
            textAlign: 'center',
            marginBottom: '24px',
            zIndex: 2,
            fontFamily: 'var(--font-heading)',
          }}
        >
          Talk to Your Database in{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Plain English
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            maxWidth: '650px',
            lineHeight: '1.6',
            marginBottom: '40px',
            zIndex: 2,
          }}
        >
          Connect Postgres, MySQL, or SQLite, ask questions in conversational language, and instantly generate, validate, and execute optimized SQL queries.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '16px', zIndex: 2, marginBottom: '60px' }}>
          <Button size="lg" glow onClick={() => navigate('/register')}>
            Get Started Free <ArrowRight size={18} />
          </Button>
          <Button size="lg" variant="secondary" onClick={() => navigate('/login')}>
            Schedule Demo
          </Button>
        </div>

        {/* 2. DYNAMIC TERMINAL PREVIEW */}
        <div
          className="glass animate-slide-up"
          style={{
            width: '100%',
            maxWidth: '800px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow)',
            zIndex: 2,
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            textAlign: 'left',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-color)',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              copilot@sql-db-assistant
            </span>
            <div style={{ width: '40px' }} />
          </div>

          {/* Console Window */}
          <div style={{ padding: '24px', minHeight: '340px', background: 'rgba(5, 5, 8, 0.95)', fontFamily: 'var(--font-mono)' }}>
            {/* Input prompt line */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '20px' }}>
              <span style={{ color: 'var(--accent)' }}>❯</span>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>
                {typedPrompt}
                {step === 'typing' && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '16px',
                      background: 'var(--accent)',
                      marginLeft: '2px',
                      animation: 'cursor-blink 1s infinite'
                    }}
                  />
                )}
              </div>
            </div>

            {/* Simulated AI streaming loader */}
            {step === 'loading' && (
              <div className="animate-fade" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <svg width="18" height="18" viewBox="0 0 38 38" stroke="var(--primary)" style={{ animation: 'spin 1s linear infinite' }}>
                  <g fill="none" fillRule="evenodd">
                    <g transform="translate(1 1)" strokeWidth="2.5">
                      <circle strokeOpacity=".2" cx="18" cy="18" r="18" />
                      <path d="M36 18c0-9.94-8.06-18-18-18" />
                    </g>
                  </g>
                </svg>
                {loadingText}
              </div>
            )}

            {/* Generated SQL block */}
            {(step === 'sql' || step === 'done') && (
              <div className="animate-fade">
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', background: 'hsl(240, 10%, 4%)', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    <span>GENERATED SQL (POSTGRESQL)</span>
                    <span style={{ color: 'var(--success)' }}>✔ VALIDATED</span>
                  </div>
                  <pre style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                    {SCENARIOS[scenarioIndex].sql}
                  </pre>
                </div>

                <div
                  className="animate-fade"
                  style={{
                    borderLeft: '3px solid var(--primary)',
                    paddingLeft: '12px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5',
                  }}
                >
                  <strong style={{ color: 'var(--text-primary)' }}>Explanation:</strong>{' '}
                  {SCENARIOS[scenarioIndex].explanation}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section
        id="features"
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '80px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            Supercharge Your DB Operations
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '10px' }}>
            Built for developers, analysts, and business beginners alike.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Card 1 */}
          <div className="card glass glass-hover">
            <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>
              <MessageSquare size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Natural Language to SQL</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Ask questions in plain English and watch the AI write the correct SQL query in real-time. Supports joins, group-by, having, and limits.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card glass glass-hover">
            <div style={{ color: 'var(--accent)', marginBottom: '16px' }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Syntax Validation</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Every query is scanned and validated before execution to prevent errors or syntax failures, ensuring safety against destructive statements.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card glass glass-hover">
            <div style={{ color: 'var(--success)', marginBottom: '16px' }}>
              <Zap size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Dialect Independence</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Generate queries optimized for PostgreSQL, MySQL, or SQLite. No need to memorize syntax differences across DBMS engines.
            </p>
          </div>

          {/* Card 4 */}
          <div className="card glass glass-hover">
            <div style={{ color: 'var(--warning)', marginBottom: '16px' }}>
              <Database size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Schema Awareness</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              The AI learns your schema structures, including foreign key relationships and data types, to generate highly accurate queries.
            </p>
          </div>

          {/* Card 5 */}
          <div className="card glass glass-hover">
            <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>
              <Code size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>SQL Playground</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Directly edit and tweak generated queries manually. Run queries, view execution times, and export outputs to CSV.
            </p>
          </div>

          {/* Card 6 */}
          <div className="card glass glass-hover">
            <div style={{ color: 'var(--accent)', marginBottom: '16px' }}>
              <Clock size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>History & Saved Queries</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Track past search histories. Bookmark and name frequently used SQL statements to re-run or share them in one click.
            </p>
          </div>
        </div>
      </section>

      {/* 4. WORKFLOW SECTION */}
      <section
        id="workflow"
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '80px 20px',
          background: 'var(--bg-secondary)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              How It Works
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '10px' }}>
              Connect and query your databases in three simple steps.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '40px',
              justifyContent: 'center',
            }}
          >
            {/* Step 1 */}
            <div style={{ flex: '1 1 300px', maxWidth: '340px', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--primary-glow)',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  margin: '0 auto 20px auto',
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Connect Your Database</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                Use our Connection Wizard to connect PostgreSQL or MySQL securely. Your credentials remain safe and local.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ flex: '1 1 300px', maxWidth: '340px', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--accent-glow)',
                  border: '1px solid var(--accent)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  margin: '0 auto 20px auto',
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Ask in Plain English</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                Chat naturally with the database assistant. Tell it what tables to search, columns to list, or filters to apply.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ flex: '1 1 300px', maxWidth: '340px', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--success-glow)',
                  border: '1px solid var(--success)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  margin: '0 auto 20px auto',
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Run & Export Results</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                Review and validation happen in milliseconds. Click Execute, view results in formatted grids, and export to CSV or PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TECH STACK SECTION */}
      <section
        id="stack"
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '80px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            Dialects & Integrations
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '10px' }}>
            Fully compatible with the database systems you already use.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '32px',
            flexWrap: 'wrap',
          }}
        >
          {['PostgreSQL', 'MySQL', 'SQLite', 'OpenAI API', 'React + TS'].map((tech) => (
            <div
              key={tech}
              className="glass"
              style={{
                padding: '16px 28px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow)',
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
