import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { initializeLiff, getUserProfile } from '../lib/liff';

export interface TokenBalances {
  kaia: number;
  zoo: number;
  wbtc: number;
}

export function useWallet() {
  const { user, profile } = useAuth();
  const [balances, setBalances] = useState<TokenBalances>({ kaia: 0, zoo: 0, wbtc: 0 });
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Initialize from profile
  useEffect(() => {
    if (profile) {
      setBalances({
        kaia: profile.total_kaia || 0,
        zoo: profile.total_zoo || 0,
        wbtc: profile.total_wbtc || 0
      });
      
      setIsWalletConnected(true);
    } else {
      setIsWalletConnected(false);
    }
  }, [profile]);
  
  // Connect wallet function
  const connectWallet = async () => {
    if (isWalletConnected) {
      return { success: true };
    }
    
    setIsConnecting(true);
    
    try {
      // Initialize LIFF
      const liffId = import.meta.env.VITE_LIFF_ID || '1234567890-abcdefgh';
      const isInitialized = await initializeLiff(liffId);
      
      if (!isInitialized) {
        throw new Error('Failed to initialize LIFF');
      }
      
      // Get LINE profile
      const lineProfile = await getUserProfile();
      
      if (!lineProfile) {
        throw new Error('Failed to get LINE profile');
      }
      
      // In a real app, you would connect this LINE profile to the user's account
      // For this demo, we'll just set the wallet as connected
      setIsWalletConnected(true);
      
      return { success: true };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return { success: false, error };
    } finally {
      setIsConnecting(false);
    }
  };
  
  return {
    balances,
    isWalletConnected,
    isConnecting,
    connectWallet
  };
}
