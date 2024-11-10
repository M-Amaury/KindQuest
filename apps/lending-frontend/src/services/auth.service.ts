import { createClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';
import { Client } from 'xrpl';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
);

export interface UserCredentials {
    username: string;
    password: string;
}

export class AuthService {
    private static async generateWallets() {
        // Générer une adresse EVM
        const evmWallet = ethers.Wallet.createRandom();
        
        // Générer une adresse XRPL
        const xrplClient = new Client("wss://s.altnet.rippletest.net:51233");
        await xrplClient.connect();
        const xrplWallet = xrplClient.createWallet();
        await xrplClient.disconnect();

        return {
            evmAddress: evmWallet.address,
            evmPrivateKey: evmWallet.privateKey,
            xrplAddress: xrplWallet.address,
            xrplSeed: xrplWallet.seed
        };
    }

    static async register(credentials: UserCredentials) {
        // Générer les wallets
        const wallets = await this.generateWallets();

        // Créer l'utilisateur dans Supabase
        const { data, error } = await supabase.auth.signUp({
            email: `${credentials.username}@kindquest.app`,
            password: credentials.password,
            options: {
                data: {
                    username: credentials.username,
                    evmAddress: wallets.evmAddress,
                    xrplAddress: wallets.xrplAddress
                }
            }
        });

        if (error) throw error;

        // Stocker les clés privées de manière sécurisée
        // Note: Dans une vraie application, il faudrait une meilleure gestion des clés privées
        localStorage.setItem(`${credentials.username}_keys`, JSON.stringify({
            evmPrivateKey: wallets.evmPrivateKey,
            xrplSeed: wallets.xrplSeed
        }));

        return data;
    }

    static async login(credentials: UserCredentials) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: `${credentials.username}@kindquest.app`,
            password: credentials.password
        });

        if (error) throw error;
        return data;
    }

    static async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

    static async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    }
} 