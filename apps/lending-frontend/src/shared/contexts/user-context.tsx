import { createContext, FC, ReactNode, useContext, useState, useEffect } from "react";
import { UserService } from '../services/user.service';
import { AuthService } from '../../services/auth.service';

export type User = {
  username: string;
  password: string;
  evmAddress: string;
  xrplAddress: string;
  isAdmin?: boolean;
};

export type UserContextApi = {
  user: User | null;
  registerUser: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
};

const UserContext = createContext<UserContextApi | null>(null);

type Props = {
  children: ReactNode;
};

export const UserProvider: FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => UserService.getCurrentUser());

  // Initialiser l'admin au démarrage
  useEffect(() => {
    UserService.initializeAdmin();
  }, []);

  const registerUser = async (username: string, password: string) => {
    try {
      console.log("Starting user registration in UserContext...");
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = UserService.getUser(username);
      if (existingUser) {
        throw new Error("Username already taken");
      }

      // Appeler le service d'authentification pour l'inscription
      console.log("Calling AuthService.register...");
      const newUser = await AuthService.register({ username, password });
      console.log("AuthService.register completed:", newUser);

      // Définir l'utilisateur directement à partir du résultat
      setUser(newUser);
      console.log("User registration completed successfully");

    } catch (error) {
      console.error("Registration failed in UserContext:", error);
      throw error;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const loggedInUser = UserService.login(username, password);
      setUser(loggedInUser);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    UserService.logout();
    setUser(null);
  };

  const value = {
    user,
    registerUser,
    login,
    logout,
    isAdmin: user?.isAdmin || false
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }
  return context;
}; 