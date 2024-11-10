import { createContext, FC, ReactNode, useContext, useState, useEffect } from "react";
import { Client } from "xrpl";

export type XRPLContextApi = {
  xrplAddress: string;
  xrpBalance: string;
  connectXRPL: () => Promise<void>;
  disconnectXRPL: () => void;
  getXRPBalance: (address: string) => Promise<string>;
};

const XRPLContext = createContext<XRPLContextApi | null>(null);

type Props = {
  children: ReactNode;
};

const DEVNET_WSS = "wss://s.devnet.rippletest.net:51233";

export const XRPLProvider: FC<Props> = ({ children }) => {
  const [xrplAddress, setXRPLAddress] = useState("");
  const [xrpBalance, setXRPBalance] = useState("0");
  const [client, setClient] = useState<Client | null>(null);

  const getXRPBalance = async (address: string) => {
    try {
      const newClient = new Client(DEVNET_WSS);
      await newClient.connect();

      try {
        const response = await newClient.request({
          command: "account_info",
          account: address,
          ledger_index: "validated"
        });
        
        await newClient.disconnect();
        
        if (response?.result?.account_data?.Balance) {
          const balance = (Number(response.result.account_data.Balance) / 1000000).toString();
          setXRPBalance(balance);
          return balance;
        }
        return "0";
      } catch (error: any) {
        // Si le compte n'est pas trouvé, on retourne simplement 0
        if (error.message && error.message.includes("Account not found")) {
          setXRPBalance("0");
          return "0";
        }
        throw error;
      }
    } catch (error) {
      console.error("Failed to get XRP balance:", error);
      return "0";
    }
  };

  const connectXRPL = async () => {
    try {
      if (client) {
        await client.disconnect();
      }
      const newClient = new Client(DEVNET_WSS);
      await newClient.connect();
      setClient(newClient);
    } catch (error) {
      console.error("Failed to connect to XRPL:", error);
    }
  };

  const disconnectXRPL = async () => {
    if (client) {
      await client.disconnect();
      setClient(null);
    }
    setXRPLAddress("");
    setXRPBalance("0");
  };

  useEffect(() => {
    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, []);

  const value = {
    xrplAddress,
    xrpBalance,
    connectXRPL,
    disconnectXRPL,
    getXRPBalance,
  };

  return <XRPLContext.Provider value={value}>{children}</XRPLContext.Provider>;
};

export const useXRPL = () => {
  const context = useContext(XRPLContext);
  if (!context) {
    throw new Error("useXRPL must be used inside XRPLProvider");
  }
  return context;
}; 