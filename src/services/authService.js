// Simulated delay to mimic network request
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const USERS_KEY = 'smart_travel_users';
const SESSION_KEY = 'smart_travel_session';

export const authService = {
  // Register a new user
  register: async (name, email, password) => {
    await delay();
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists with this email.');
    }

    const newUser = { id: Date.now().toString(), name, email, password };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Automatically log in after registration
    return authService.login(email, password);
  },

  // Login a user
  login: async (email, password) => {
    await delay();
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const sessionUser = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  // Logout a user
  logout: async () => {
    await delay(300);
    localStorage.removeItem(SESSION_KEY);
  },

  // Get current logged-in user
  getCurrentUser: () => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }
};
