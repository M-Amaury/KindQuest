import { BrowserProvider, Contract, JsonRpcProvider, Wallet } from "ethers";
import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { KindToken } from "../../contracts/types";
import contractAddresses from "../../contracts/contract-addresses.json";

const KIND_TOKEN_ABI = [
  // Lecture
  "function balanceOf(address) view returns (uint256)",
  "function missionCount() view returns (uint256)",
  "function missions(uint256) view returns (string title, string description, uint256 xpReward, uint256 xrpReward, bool active)",
  "function isParticipantRewarded(uint256 missionId, address participant) view returns (bool)",
  "function verifiers(address) view returns (bool)",
  
  // Écriture
  "function mint(address to, uint256 amount) external",
  "function burn(uint256 amount) external",
  "function burnFrom(address account, uint256 amount) external",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function addVerifier(address verifier) external",
  "function removeVerifier(address verifier) external",
  "function createMission(string title, string description, uint256 xpReward, uint256 xrpReward) external",
  "function completeMissionForParticipant(uint256 missionId, address participant) external",
  "function closeMission(uint256 missionId) external",
  
  // Événements
  "event MissionCreated(uint256 indexed missionId, string title, uint256 xpReward, uint256 xrpReward)",
  "event MissionCompleted(uint256 indexed missionId, address indexed participant)",
  "event VerifierAdded(address indexed verifier)",
  "event VerifierRemoved(address indexed verifier)",
  "event TokensMinted(address indexed to, uint256 amount)",
  "event TokensBurned(address indexed from, uint256 amount)"
];

export type Web3ContextApi = {
  account: string;
  kindBalance: string;
  connectWallet: () => Promise<void>;
  contract: KindToken | null;
  disconnect: () => void;
  isOwner: boolean;
  refreshBalance: (address: string) => Promise<void>;
};

const Web3Context = createContext<Web3ContextApi | null>(null);

type Props = {
  children: ReactNode;
};

const ADMIN_PRIVATE_KEY = import.meta.env.VITE_ADMIN_PRIVATE_KEY || "";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const Web3Provider: FC<Props> = ({ children }) => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState<KindToken | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [kindBalance, setKindBalance] = useState("0");

  // Initialize contract with admin account
  useEffect(() => {
    if (!ADMIN_PRIVATE_KEY) {
      console.error("Admin private key not found in environment variables");
      return;
    }

    try {
      const provider = new JsonRpcProvider("https://rpc-evm-sidechain.xrpl.org");
      const adminWallet = new Wallet(ADMIN_PRIVATE_KEY, provider);
      const kindToken = new Contract(
        contractAddresses.kindToken,
        KIND_TOKEN_ABI,
        adminWallet
      ) as KindToken;
      setContract(kindToken);
    } catch (error) {
      console.error("Failed to initialize contract:", error);
    }
  }, []);

  const getKindBalance = async (address: string) => {
    if (!contract) return "0";
    try {
      const balance = await contract.balanceOf(address);
      const formattedBalance = (Number(balance) / 1e18).toString();
      console.log(`Balance for ${address}: ${formattedBalance} KIND`);
      setKindBalance(formattedBalance);
      return formattedBalance;
    } catch (error) {
      console.error("Failed to get KIND balance:", error);
      return "0";
    }
  };

  const refreshBalance = async (address: string) => {
    console.log("Refreshing balance for address:", address);
    await getKindBalance(address);
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      console.error("MetaMask is not installed");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];
      setAccount(address);

      // Mettre à jour le contrat avec le signer connecté
      const signer = await provider.getSigner();
      const connectedContract = new Contract(
        contractAddresses.kindToken,
        KIND_TOKEN_ABI,
        signer
      ) as KindToken;
      setContract(connectedContract);

      // Vérifier si l'adresse est le propriétaire
      // Vous devrez ajouter cette fonction dans votre contrat
      // setIsOwner(await connectedContract.owner() === address);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnect = () => {
    setAccount("");
    setIsOwner(false);
    setKindBalance("0");
  };

  // Rafraîchir le solde quand le contrat ou le compte change
  useEffect(() => {
    if (contract && account) {
      getKindBalance(account);
    }
  }, [contract, account]);

  const value = {
    account,
    kindBalance,
    connectWallet,
    contract,
    disconnect,
    isOwner,
    refreshBalance,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used inside Web3Provider");
  }
  return context;
};
