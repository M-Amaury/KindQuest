import { ethers } from 'ethers';
import { Wallet } from "xrpl";
import { UserService } from './user.service';

export interface UserCredentials {
    username: string;
    password: string;
}

export class AuthService {
    private static async generateWallets() {
        console.log("=== Starting wallet generation process ===");
        
        try {
            // Générer une adresse EVM
            const evmWallet = ethers.Wallet.createRandom();
            console.log("EVM wallet generated:", {
                address: evmWallet.address
            });
            
            // Générer le wallet XRPL
            console.log("Generating XRPL wallet...");
            const xrplWallet = Wallet.generate();
            console.log("XRPL wallet generated:", {
                address: xrplWallet.classicAddress
            });

            return {
                evmAddress: evmWallet.address,
                evmPrivateKey: evmWallet.privateKey,
                xrplAddress: xrplWallet.classicAddress,
                xrplSeed: xrplWallet.seed
            };

        } catch (error) {
            console.error("=== Wallet generation failed ===");
            console.error("Error details:", error);
            throw error;
        }
    }

    static async register(credentials: UserCredentials) {
        console.log("=== Starting registration process ===");
        console.log("Registering user:", credentials.username);
        
        try {
            console.log("Generating wallets...");
            const wallets = await this.generateWallets();
            console.log("Wallets generated:", {
                evmAddress: wallets.evmAddress,
                xrplAddress: wallets.xrplAddress
            });

            // Créer l'utilisateur dans le localStorage via UserService
            const newUser = UserService.saveUser(
                credentials.username,
                credentials.password,
                wallets.evmAddress,
                wallets.xrplAddress
            );

            console.log("User created successfully");

            // Stocker les clés privées
            localStorage.setItem(`${credentials.username}_keys`, JSON.stringify({
                evmPrivateKey: wallets.evmPrivateKey,
                xrplSeed: wallets.xrplSeed
            }));
            console.log("Wallet keys stored in localStorage");

            return newUser;
        } catch (error) {
            console.error("=== Registration process failed ===");
            console.error("Error details:", error);
            throw error;
        }
    }

    static async login(credentials: UserCredentials) {
        return UserService.login(credentials.username, credentials.password);
    }

    static async logout() {
        UserService.logout();
    }

    static getCurrentUser() {
        return UserService.getCurrentUser();
    }
} 