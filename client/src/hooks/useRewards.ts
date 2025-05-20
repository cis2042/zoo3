import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { rewardsAPI } from '../lib/api';
import { LoginStreak, Transaction } from '../types';

export function useRewards() {
  const { user } = useAuth();
  const [loginStreak, setLoginStreak] = useState<LoginStreak>({
    id: '',
    userId: '',
    streakDays: 0,
    currentDay: 0,
    daysCompleted: [],
    days: [0, 1, 2, 3, 4, 5, 6].map(day => ({
      day: day + 1,
      completed: false
    }))
  });
  const [todaysClaimed, setTodaysClaimed] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch login streak when user changes
  useEffect(() => {
    if (user) {
      fetchLoginStreak();
      fetchTransactions();
    }
  }, [user]);
  
  // Fetch login streak
  const fetchLoginStreak = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await rewardsAPI.getLoginStreak();
      
      if (response.data.success) {
        setLoginStreak(response.data.data.streak);
        setTodaysClaimed(response.data.data.todaysClaimed);
      }
    } catch (error) {
      console.error('Error fetching login streak:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch transactions
  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      const response = await rewardsAPI.getTransactions();
      
      if (response.data.success) {
        setTransactions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  
  // Claim daily reward
  const claimDaily = async () => {
    if (!user || todaysClaimed) return;
    
    try {
      setIsLoading(true);
      const response = await rewardsAPI.claimDailyReward();
      
      if (response.data.success) {
        // Refresh login streak and transactions
        await fetchLoginStreak();
        await fetchTransactions();
        
        return {
          success: true,
          reward: response.data.data.reward
        };
      } else {
        return {
          success: false,
          error: response.data.error
        };
      }
    } catch (error: any) {
      console.error('Error claiming daily reward:', error);
      return {
        success: false,
        error: error.response?.data?.error || '領取獎勵時發生錯誤'
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    loginStreak,
    todaysClaimed,
    transactions,
    isLoading,
    claimDaily,
    refreshLoginStreak: fetchLoginStreak,
    refreshTransactions: fetchTransactions
  };
}
