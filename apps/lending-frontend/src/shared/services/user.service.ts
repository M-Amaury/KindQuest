import { User } from '../contexts/user-context';

const STORAGE_PREFIX = 'kindquest_';

export const UserService = {
  saveUser: (username: string, password: string, evmAddress: string, xrplAddress: string, isAdmin: boolean = false) => {
    const users = JSON.parse(sessionStorage.getItem(`${STORAGE_PREFIX}users`) || '{}');
    
    users[username] = {
      username,
      password,
      evmAddress,
      xrplAddress,
      isAdmin
    };

    sessionStorage.setItem(`${STORAGE_PREFIX}users`, JSON.stringify(users));
    sessionStorage.setItem(`${STORAGE_PREFIX}currentUser`, JSON.stringify(users[username]));
    
    return users[username];
  },

  getCurrentUser: (): User | null => {
    const currentUser = sessionStorage.getItem(`${STORAGE_PREFIX}currentUser`);
    return currentUser ? JSON.parse(currentUser) : null;
  },

  getUser: (username: string): User | null => {
    const users = JSON.parse(sessionStorage.getItem(`${STORAGE_PREFIX}users`) || '{}');
    return users[username] || null;
  },

  getAllUsers: () => {
    return JSON.parse(sessionStorage.getItem(`${STORAGE_PREFIX}users`) || '{}');
  },

  login: (username: string, password: string): User => {
    const users = JSON.parse(sessionStorage.getItem(`${STORAGE_PREFIX}users`) || '{}');
    const user = users[username];

    if (!user || user.password !== password) {
      throw new Error("Invalid username or password");
    }

    sessionStorage.setItem(`${STORAGE_PREFIX}currentUser`, JSON.stringify(user));
    return user;
  },

  logout: () => {
    sessionStorage.removeItem(`${STORAGE_PREFIX}currentUser`);
  },

  initializeAdmin: () => {
    const users = JSON.parse(sessionStorage.getItem(`${STORAGE_PREFIX}users`) || '{}');
    
    if (!users['admin']) {
      const adminUser = {
        username: 'admin',
        password: 'admin',
        evmAddress: '0x65254408b633bcaC43eC5c4c2C538e86893af113',
        xrplAddress: 'rsnxpfwwWs6fVNaPVhGdKFBAukTPmC6NP5',
        isAdmin: true
      };

      users['admin'] = adminUser;
      sessionStorage.setItem(`${STORAGE_PREFIX}users`, JSON.stringify(users));
    }
  }
}; 