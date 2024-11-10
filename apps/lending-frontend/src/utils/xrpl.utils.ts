import { Wallet } from "xrpl";


export const fundWallet = async (
  wallet: Wallet,
): Promise<{ wallet: any; balance: number }> => {
  console.log("Starting fundWallet process for devnet wallet:", wallet.classicAddress);

  try {
    // Utiliser le faucet testnet
    const response = await fetch('https://faucet-devnet.rippletest.net/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: wallet.classicAddress
      })
    });

    if (!response.ok) {
      throw new Error(`Faucet request failed: ${response.statusText}`);
    }

    const faucetResult = await response.json();
    console.log("Faucet response:", faucetResult);

    // Attendre un peu pour que le funding soit effectif
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Retourner le wallet avec le résultat du faucet
    return {
      wallet: wallet,
      balance: 1000 // Le faucet donne généralement 1000 XRP
    };
  } catch (error) {
    console.error("Error in devnet fundWallet:", error);
    throw error;
  }
}; 