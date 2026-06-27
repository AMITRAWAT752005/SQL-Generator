export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const USERS_KEY = 'sql_gen_users';
const SESSION_KEY = 'sql_gen_session';

// Helper to get users from localStorage
const getUsers = (): any[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Helper to save users
const saveUsers = (users: any[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate api delay
    const users = getUsers();

    if (users.some((u) => u.email === email)) {
      throw new Error('Email already registered.');
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password, // In real app, this is hashed on backend
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  },

  login: async (email: string, password: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate api delay
    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    localStorage.removeItem(SESSION_KEY);
  },

  forgotPassword: async (email: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const users = getUsers();
    if (!users.some((u) => u.email === email)) {
      throw new Error('No account found with this email.');
    }
  },

  resetPassword: async (email: string, newPassword: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const users = getUsers();
    const userIdx = users.findIndex((u) => u.email === email);
    if (userIdx === -1) {
      throw new Error('User not found.');
    }
    users[userIdx].password = newPassword;
    saveUsers(users);
  }
};
