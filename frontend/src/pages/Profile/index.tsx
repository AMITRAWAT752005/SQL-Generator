import React, { useEffect, useState } from 'react';
import { profileService, UserProfile } from '../../services/profile.service';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { User, Mail, Settings2, ShieldCheck, Sparkles, Clock3 } from 'lucide-react';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stored = profileService.getProfile();
    setProfile(stored);
    setName(stored.name);
    setEmail(stored.email);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSaving(true);
    setMessage(null);
    try {
      const updated = await profileService.updateProfile(name, email);
      setProfile(updated);
      setMessage('Profile updated successfully.');
    } catch (error: any) {
      setMessage(error?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Profile</p>
          <h1 style={{ margin: '8px 0 0', fontSize: '2.25rem', fontWeight: 800 }}>Your account details</h1>
          <p style={{ margin: '12px 0 0', maxWidth: '680px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Update your name and email, and review the preferences that the assistant uses for your experience.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Badge variant="primary">{profile?.preferences.dialect.toUpperCase()}</Badge>
          <Badge variant="success">{profile?.preferences.streamingSpeed}</Badge>
        </div>
      </div>

      {message && (
        <div style={{ padding: '16px', borderRadius: '16px', background: 'var(--success-glow)', border: '1px solid var(--success)', color: 'var(--success)' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '22px' }}>
        <Card title="Account Information" subtitle="Personal details for your account">
          <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px' }}>
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required icon={<User size={16} />} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required icon={<Mail size={16} />} />
            <Button type="submit" size="lg" variant="primary" isLoading={isSaving}>
              Save Profile
            </Button>
          </form>
        </Card>

        <Card title="Preference Snapshot" subtitle="Current profile settings">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Settings2 size={18} style={{ color: 'var(--primary)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Theme: {profile?.preferences.theme}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={18} style={{ color: 'var(--success)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Notifications: {profile?.preferences.notifications ? 'On' : 'Off'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Sparkles size={18} style={{ color: 'var(--accent)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Default Dialect: {profile?.preferences.dialect}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Clock3 size={18} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Streaming Speed: {profile?.preferences.streamingSpeed}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
