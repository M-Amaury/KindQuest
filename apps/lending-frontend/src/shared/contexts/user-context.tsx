import { createContext, FC, ReactNode, useContext, useState, useEffect } from "react";
import { Wallet } from "ethers";
import { Wallet as XrplWallet } from "xrpl";
import { UserService } from '../services/user.service';

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

// Fonction pour générer une adresse XRPL valide
const generateXRPLWallet = () => {
  const wallet = XrplWallet.generate();
  return {
    address: wallet.address,
    seed: wallet.seed
  };
};

export const UserProvider: FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => UserService.getCurrentUser());

  // Initialiser l'admin au démarrage
  useEffect(() => {
    UserService.initializeAdmin();
  }, []);

  const registerUser = async (username: string, password: string) => {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = UserService.getUser(username);
      if (existingUser) {
        throw new Error("Username already taken");
      }

      // Générer une nouvelle adresse EVM
      const evmWallet = Wallet.createRandom();
      const evmAddress = evmWallet.address;

      // Générer une nouvelle adresse XRPL valide
      const xrplWallet = generateXRPLWallet();
      const xrplAddress = xrplWallet.address;

      // Créer et sauvegarder l'utilisateur
      const newUser = UserService.saveUser(
        username,
        password,
        evmAddress,
        xrplAddress
      );
      
      setUser(newUser);

      console.log("Created user with addresses:", {
        evm: evmAddress,
        xrpl: xrplAddress
      });

    } catch (error) {
      console.error("Failed to register user:", error);
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