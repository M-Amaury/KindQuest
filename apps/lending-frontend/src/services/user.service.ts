import { User } from '../shared/contexts/user-context';

export class UserService {
  private static USERS_KEY = 'users';
  private static CURRENT_USER_KEY = 'currentUser';
  private static ADMIN_ADDRESS = '0x65254408b633bcac43ec5c4c2c538e86893af113';

  static getAllUsers(): Record<string, User> {
    const usersJson = localStorage.getItem(this.USERS_KEY);
    console.log("Raw users from localStorage:", usersJson);
    
    let users = {};
    try {
      users = usersJson ? JSON.parse(usersJson) : {};
      console.log("Successfully parsed users:", users);
    } catch (error) {
      console.error("Error parsing users from localStorage:", error);
      localStorage.setItem(this.USERS_KEY, JSON.stringify({}));
    }
    
    return users;
  }

  static saveUser(
    username: string,
    password: string,
    evmAddress: string,
    xrplAddress: string
  ): User {
    console.log("Saving new user:", { username, evmAddress, xrplAddress });
    
    const users = this.getAllUsers();
    const newUser = {
      username,
      password,
      evmAddress,
      xrplAddress,
      isAdmin: false
    };

    users[username] = newUser;
    console.log("Updated users object:", users);
    
    // Sauvegarder dans le localStorage
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(newUser));
    
    console.log("User saved successfully");
    return newUser;
  }

  static getUser(username: string): User | null {
    const users = this.getAllUsers();
    return users[username] || null;
  }

  static getUserByEvmAddress(evmAddress: string): User | null {
    console.log("Searching for EVM address:", evmAddress);
    
    // Récupérer tous les utilisateurs
    const users = this.getAllUsers();
    console.log("All users in storage:", users);
    
    // Convertir l'adresse recherchée en minuscules
    const searchAddress = evmAddress.toLowerCase();
    console.log("Normalized search address:", searchAddress);
    
    // Chercher l'utilisateur
    const user = Object.values(users).find(u => {
      const storedAddress = u.evmAddress.toLowerCase();
      console.log("Comparing with stored address:", storedAddress);
      return storedAddress === searchAddress;
    });
    
    if (user) {
      console.log("Found matching user:", user);
    } else {
      console.log("No matching user found");
      // Afficher toutes les adresses stockées pour le débogage
      const storedAddresses = Object.values(users).map(u => u.evmAddress.toLowerCase());
      console.log("All stored addresses:", storedAddresses);
    }
    
    return user || null;
  }

  static getCurrentUser(): User | null {
    const currentUser = localStorage.getItem(this.CURRENT_USER_KEY);
    return currentUser ? JSON.parse(currentUser) : null;
  }

  static login(username: string, password: string): User {
    const users = this.getAllUsers();
    const user = users[username];

    if (!user || user.password !== password) {
      throw new Error("Invalid username or password");
    }

    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }

  static logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  static initializeAdmin(): void {
    const users = this.getAllUsers();
    
    if (!users['admin']) {
      const adminUser = {
        username: 'admin',
        password: 'admin',
        evmAddress: this.ADMIN_ADDRESS,
        xrplAddress: 'rsnxpfwwWs6fVNaPVhGdKFBAukTPmC6NP5',
        isAdmin: true
      };

      users['admin'] = adminUser;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
  }
} 