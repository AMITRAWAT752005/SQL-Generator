import React, { useEffect, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { profileService, ProfilePreferences, UserProfile } from '../../services/profile.service';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Sun, Moon, Database as DatabaseIcon, Zap, Bell, Settings2 } from 'lucide-react';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<ProfilePreferences>({
    theme: 'dark',
    dialect: 'postgresql',
    streamingSpeed: 'normal',
    notifications: true,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stored = profileService.getProfile();
    setProfile(stored);
    setPreferences(stored.preferences);
  }, []);

  const handleChange = (updates: Partial<ProfilePreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      if (preferences.theme !== theme) {
        toggleTheme();
      }
      const updated = await profileService.updatePreferences(preferences);
      setProfile(updated);
      setMessage('Settings saved successfully.');
    } catch (error: any) {
      setMessage(error?.message || 'Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Settings</p>
          <h1 style={{ margin: '8px 0 0', fontSize: '2.25rem', fontWeight: 800 }}>Control your assistant experience</h1>
          <p style={{ margin: '12px 0 0', maxWidth: '680px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Customize theme, default SQL dialect, streaming behavior, and notifications for the frontend experience.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Badge variant="primary">Theme: {theme}</Badge>
          <Badge variant="accent">Dialect: {preferences.dialect}</Badge>
        </div>
      </div>

      {message && (
        <div style={{ padding: '16px', borderRadius: '16px', background: 'var(--success-glow)', border: '1px solid var(--success)', color: 'var(--success)' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '22px' }}>
        <Card title="Preference Controls" subtitle="Adjust your default experience settings">
          <div style={{ display: 'grid', gap: '18px' }}>
            <div style={{ display: 'grid', gap: '10px' }}>
              <label style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Theme</label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {(['light', 'dark'] as const).map((option) => (
                  <Button
                    key={option}
                    variant={preferences.theme === option ? 'primary' : 'secondary'}
                    size="md"
                    onClick={() => handleChange({ theme: option })}
                  >
                    {option === 'light' ? <Sun size={16} /> : <Moon size={16} />} {option}
                  </Button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              <label style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Default SQL Dialect</label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {(['postgresql', 'mysql', 'sqlite', 'mssql'] as const).map((dialectOption) => (
                  <Button
                    key={dialectOption}
                    variant={preferences.dialect === dialectOption ? 'primary' : 'secondary'}
                    size="md"
                    onClick={() => handleChange({ dialect: dialectOption })}
                  >
                    <DatabaseIcon size={16} /> {dialectOption.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              <label style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Streaming Speed</label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {(['normal', 'fast', 'slow'] as const).map((speed) => (
                  <Button
                    key={speed}
                    variant={preferences.streamingSpeed === speed ? 'primary' : 'secondary'}
                    size="md"
                    onClick={() => handleChange({ streamingSpeed: speed })}
                  >
                    <Zap size={16} /> {speed}
                  </Button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              <label style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button
                  variant={preferences.notifications ? 'primary' : 'secondary'}
                  size="md"
                  onClick={() => handleChange({ notifications: true })}
                >
                  <Bell size={16} /> On
                </Button>
                <Button
                  variant={!preferences.notifications ? 'primary' : 'secondary'}
                  size="md"
                  onClick={() => handleChange({ notifications: false })}
                >
                  <Bell size={16} /> Off
                </Button>
              </div>
            </div>

            <Button type="button" variant="primary" size="lg" onClick={handleSave} isLoading={isSaving}>
              Save Settings
            </Button>
          </div>
        </Card>

        <Card title="Why these settings matter" subtitle="Your workspace and assistant behavior">
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Settings2 size={18} style={{ color: 'var(--primary)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Personalized UI theme for desktop and dashboard layouts.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <DatabaseIcon size={18} style={{ color: 'var(--accent)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Choose a SQL dialect to align the assistant with your database flavor.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Zap size={18} style={{ color: 'var(--success)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Streaming speed controls how quickly assistant responses feel in the chat.</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
