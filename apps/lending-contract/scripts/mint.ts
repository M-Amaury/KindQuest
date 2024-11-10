import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  try {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error("CONTRACT_ADDRESS not set in .env file");
    }

    const KindToken = await ethers.getContractFactory("KindToken");
    const kindToken = await KindToken.attach(contractAddress);

    const [owner] = await ethers.getSigners();
    console.log("Minting tokens using account:", owner.address);

    // Paramètres du mint
    const recipientAddress = process.env.RECIPIENT_ADDRESS || owner.address;
    const amount = ethers.parseEther("1000"); // 1000 tokens

    // Mint les tokens
    console.log(`Minting ${amount} tokens to ${recipientAddress}...`);
    const tx = await kindToken.mint(recipientAddress, amount);
    await tx.wait();
    console.log("Tokens minted successfully!");

    // Vérifier le nouveau solde
    const balance = await kindToken.balanceOf(recipientAddress);
    console.log(`New balance for ${recipientAddress}: ${ethers.formatEther(balance)} KIND`);

  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 