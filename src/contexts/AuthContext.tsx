import React, { useEffect, useState, createContext, useContext } from 'react';
import { connectWallet, disconnectWallet, getAvailableWallets } from '../services/walletService';
import { getWalletBalance } from '../services/blockfrost';
export type UserRole = 'user' | 'admin' | 'officer';
export interface User {
  id: string;
  username: string;
  walletAddress?: string;
  stakeAddress?: string;
  walletName?: string;
  role: UserRole;
  isWalletConnected: boolean;
  balance?: number;
}
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  connectWallet: (walletName?: string) => Promise<void>;
  disconnectWallet: () => void;
  logout: () => void;
  error: string | null;
  availableWallets: string[];
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<string[]>([]);
  useEffect(() => {
    // Check for saved auth state
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    // Get available wallets
    const fetchWallets = async () => {
      const wallets = await getAvailableWallets();
      setAvailableWallets(wallets);
    };
    fetchWallets();
    setIsLoading(false);
  }, []);
  // Update local storage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
  
      await new Promise(resolve => setTimeout(resolve, 1000));
     
      if (username === 'admin' && password === 'admin') {
        setUser({
          id: '1',
          username: 'admin',
          role: 'admin',
          isWalletConnected: false
        });
      } else if (username === 'officer' && password === 'officer') {
        setUser({
          id: '2',
          username: 'officer',
          role: 'officer',
          isWalletConnected: false
        });
      } else if (username && password) {
        setUser({
          id: '3',
          username,
          role: 'user',
          isWalletConnected: false
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };
  const connectUserWallet = async (walletName?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      if (!walletName && availableWallets.length > 0) {
        walletName = availableWallets[0];
      }
      if (!walletName) {
        throw new Error('No wallet available to connect');
      }
      // Connect to wallet using MeshSDK
      const walletData = await connectWallet(walletName);
      const stakeAddress = 'stake1u9tknpepp76v689pkfpv5un2nmm86gllvy0fte7ag03xyjc59tsk9'; // Provided stake address
      // Get wallet balance
      const balance = await getWalletBalance(stakeAddress);
      if (user) {
        // Update user with wallet info
        setUser({
          ...user,
          walletAddress: walletData.changeAddress,
          stakeAddress,
          walletName,
          isWalletConnected: true,
          balance
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };
  const disconnectUserWallet = () => {
    disconnectWallet();
    if (user) {
      setUser({
        ...user,
        walletAddress: undefined,
        stakeAddress: undefined,
        walletName: undefined,
        isWalletConnected: false,
        balance: undefined
      });
    }
  };
  const logout = () => {
    if (user?.isWalletConnected) {
      disconnectWallet();
    }
    setUser(null);
    localStorage.removeItem('user');
  };
  return <AuthContext.Provider value={{
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    connectWallet: connectUserWallet,
    disconnectWallet: disconnectUserWallet,
    logout,
    error,
    availableWallets
  }}>
      {children}
    </AuthContext.Provider>;
};
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};