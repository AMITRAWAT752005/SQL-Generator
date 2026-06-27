import { apiClient } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthResponse {
  user?: User;
  token?: string;
}

const USERS_KEY = 'sql_gen_users';
const SESSION_KEY = 'sql_gen_session';

const getUsers = (): any[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users: any[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const saveSession = (user: User, token?: string) => {
  const sessionValue = token ? { ...user, token } : user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionValue));
};

export const authService = {
  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return null;

    try {
      const parsed = JSON.parse(session);
      const { token, ...user } = parsed;
      return user as User;
    } catch {
      return null;
    }
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    if (!apiClient.isMockEnabled()) {
      const response = await apiClient.post<AuthResponse>('/auth/register', {
        name,
        email,
        password,
      });

      const user = response.user ?? (response as unknown as User);
      const token = response.token;
      saveSession(user, token);
      return user;
    }

    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate api delay
    const users = getUsers();

    if (users.some((u) => u.email === email)) {
      throw new Error('Email already registered.');
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    saveSession(userWithoutPassword);
    return userWithoutPassword;
  },

  login: async (email: string, password: string): Promise<User> => {
    if (!apiClient.isMockEnabled()) {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      const user = response.user ?? (response as unknown as User);
      const token = response.token;
      saveSession(user, token);
      return user;
    }

    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate api delay
    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const { password: _, ...userWithoutPassword } = user;
    saveSession(userWithoutPassword);
    return userWithoutPassword;
  },

  logout: async (): Promise<void> => {
    if (!apiClient.isMockEnabled()) {
      try {
        await apiClient.post('/auth/logout');
      } catch {
        // Ignore logout failures when not connected
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 400));
    }

    localStorage.removeItem(SESSION_KEY);
  },

  forgotPassword: async (email: string): Promise<void> => {
    if (!apiClient.isMockEnabled()) {
      await apiClient.post('/auth/forgot-password', { email });
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    const users = getUsers();
    if (!users.some((u) => u.email === email)) {
      throw new Error('No account found with this email.');
    }
  },

  resetPassword: async (email: string, newPassword: string): Promise<void> => {
    if (!apiClient.isMockEnabled()) {
      await apiClient.post('/auth/reset-password', {
        email,
        password: newPassword,
      });
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 800));
    const users = getUsers();
    const userIdx = users.findIndex((u) => u.email === email);
    if (userIdx === -1) {
      throw new Error('User not found.');
    }
    users[userIdx].password = newPassword;
    saveUsers(users);
  },
};
