import { ethers } from "hardhat";

async function main() {
  // Déploiement du KindToken uniquement
  const KindToken = await ethers.getContractFactory("KindToken");
  const kindToken = await KindToken.deploy();
  await kindToken.waitForDeployment();
  console.log("KindToken deployed to:", await kindToken.getAddress());

  // Sauvegarder l'adresse du contrat
  const addresses = {
    kindToken: await kindToken.getAddress()
  };

  // Écrire l'adresse dans un fichier
  const fs = require("fs");
  const path = require("path");
  const contractsDir = path.join(__dirname, "..", "..", "lending-frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-addresses.json"),
    JSON.stringify(addresses, undefined, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
