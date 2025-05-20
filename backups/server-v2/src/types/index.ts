// User types
export interface User {
  id: string;
  email: string;
  display_name?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  total_tasks_completed: number;
  total_kaia: number;
  total_zoo: number;
  total_wbtc: number;
  login_streak: number;
  last_login_date?: Date;
  referral_code: string;
  created_at: Date;
  referral_count?: number;
}

// Task types
export interface Task {
  id: string;
  title: string;
  description: string;
  reward_amount: number;
  reward_token: string;
  task_type: string;
  redirect_url?: string;
  created_at: Date;
}

export interface TaskCompletion {
  id: string;
  user_id: string;
  task_id: string;
  completed_at: Date;
}

// Transaction types
export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  token: string;
  transaction_type: string;
  reference_id?: string;
  description?: string;
  created_at: Date;
}

// Referral types
export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  reward_claimed: boolean;
  reward_amount?: number;
  reward_token?: string;
  created_at: Date;
}

// Login streak types
export interface LoginStreak {
  id: string;
  user_id: string;
  streak_days: number;
  current_day: number;
  last_claimed_at?: Date;
  days_completed: string[];
  created_at: Date;
}

// Achievement types
export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_level: number;
  unlocked_at: Date;
  current_progress: number;
  next_target: number;
  created_at: Date;
}

// API response type
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
