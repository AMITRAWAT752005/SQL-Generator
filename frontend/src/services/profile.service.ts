export interface ProfilePreferences {
  theme: 'light' | 'dark';
  dialect: 'postgresql' | 'mysql' | 'sqlite' | 'mssql';
  streamingSpeed: 'normal' | 'fast' | 'slow';
  notifications: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  preferences: ProfilePreferences;
}

const PREF_KEY = 'sql_gen_profile';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Demo Admin',
  email: 'admin@sqlcopilot.ai',
  preferences: {
    theme: 'dark',
    dialect: 'postgresql',
    streamingSpeed: 'normal',
    notifications: true
  }
};

export const profileService = {
  getProfile: (): UserProfile => {
    const prof = localStorage.getItem(PREF_KEY);
    if (!prof) {
      localStorage.setItem(PREF_KEY, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return JSON.parse(prof);
  },

  updateProfile: async (name: string, email: string): Promise<UserProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const profile = profileService.getProfile();
    profile.name = name;
    profile.email = email;
    localStorage.setItem(PREF_KEY, JSON.stringify(profile));
    return profile;
  },

  updatePreferences: async (preferences: Partial<ProfilePreferences>): Promise<UserProfile> => {
    const profile = profileService.getProfile();
    profile.preferences = { ...profile.preferences, ...preferences };
    localStorage.setItem(PREF_KEY, JSON.stringify(profile));
    return profile;
  }
};
