-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (replacing Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reward_amount NUMERIC NOT NULL,
  reward_token TEXT NOT NULL,
  task_type TEXT NOT NULL,
  redirect_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task completions table
CREATE TABLE IF NOT EXISTS task_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  token TEXT NOT NULL,
  transaction_type TEXT NOT NULL,
  reference_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  total_tasks_completed INTEGER DEFAULT 0,
  total_kaia NUMERIC DEFAULT 0,
  total_zoo NUMERIC DEFAULT 0,
  total_wbtc NUMERIC DEFAULT 0,
  login_streak INTEGER DEFAULT 0,
  last_login_date TIMESTAMPTZ,
  referral_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_claimed BOOLEAN DEFAULT FALSE,
  reward_amount NUMERIC,
  reward_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

-- Login streaks table
CREATE TABLE IF NOT EXISTS login_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  streak_days INTEGER DEFAULT 0,
  current_day INTEGER DEFAULT 0,
  last_claimed_at TIMESTAMPTZ,
  days_completed TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_level INTEGER NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL,
  current_progress INTEGER NOT NULL,
  next_target INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample tasks
INSERT INTO tasks (title, description, reward_amount, reward_token, task_type, redirect_url)
VALUES 
('加入 Discord 社區', '加入 ZOO3 官方 Discord 社區並完成身份驗證', 5, 'ZOO', 'discord', 'https://discord.gg/zoo3'),
('社交媒體分享', '在您的社交媒體帳戶上分享 ZOO3', 5, 'ZOO', 'social_share', NULL),
('完成加密貨幣測驗', '參加並通過我們的加密貨幣基礎知識測驗', 0.0001, 'WBTC', 'quiz', NULL),
('連接 LINE 錢包', '將您的 LINE 錢包連接到 ZOO3 平台', 3, 'ZOO', 'connect_wallet', NULL),
('訪問每個頁面', '訪問 ZOO3 平台的所有頁面', 1, 'KAIA', 'visit_pages', NULL);
