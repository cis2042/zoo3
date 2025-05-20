import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile } from '../types';
import { authAPI, userAPI } from '../lib/api';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);
  
  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      
      const response = await authAPI.getCurrentUser();
      
      if (response.data.success) {
        setUser(response.data.data.user);
        setProfile(response.data.data.profile);
      } else {
        // Token might be invalid, clear it
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.data.success) {
        const { user, profile, token } = response.data.data;
        
        // Save token to localStorage
        localStorage.setItem('token', token);
        
        // Update state
        setUser(user);
        setProfile(profile);
        
        return { success: true };
      } else {
        return { success: false, error: response.data.error };
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || '登入時發生錯誤' 
      };
    }
  };
  
  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const response = await authAPI.register({ email, password, displayName });
      
      if (response.data.success) {
        const { user, profile, token } = response.data.data;
        
        // Save token to localStorage
        localStorage.setItem('token', token);
        
        // Update state
        setUser(user);
        setProfile(profile);
        
        return { success: true };
      } else {
        return { success: false, error: response.data.error };
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || '註冊時發生錯誤' 
      };
    }
  };
  
  const signOut = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    
    // Reset state
    setUser(null);
    setProfile(null);
  };
  
  const refreshProfile = async () => {
    try {
      const response = await userAPI.getUserProfile();
      
      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };
  
  const value = {
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshProfile
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
