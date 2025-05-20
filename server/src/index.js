const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 8080;

// CORS configuration
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Helper functions
const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.split(' ')[1];
    return Buffer.from(token, 'base64').toString();
  } catch (error) {
    console.error('Token decoding error:', error);
    return null;
  }
};

// Middleware to check if user is authenticated
const authenticateUser = (req, res, next) => {
  const userId = getUserIdFromToken(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: '未授權'
    });
  }

  req.userId = userId;
  next();
};

// Middleware to check if user is admin
const authenticateAdmin = (req, res, next) => {
  const userId = getUserIdFromToken(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: '未授權'
    });
  }

  const user = db.users.find(u => u.id === userId);

  if (!user || user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: '權限不足'
    });
  }

  req.userId = userId;
  next();
};

// Simple in-memory database for demo purposes
const db = {
  tasks: [
    {
      id: '1',
      title: '加入 Discord 社區',
      description: '加入 ZOO3 官方 Discord 社區並完成身份驗證',
      reward_amount: 5,
      reward_token: 'ZOO',
      task_type: 'discord',
      frequency: 'once',
      category: 'social',
      difficulty: 'easy',
      is_active: true,
      redirect_url: 'https://discord.gg/zoo3',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      title: '社交媒體分享',
      description: '在您的社交媒體帳戶上分享 ZOO3',
      reward_amount: 5,
      reward_token: 'ZOO',
      task_type: 'social_share',
      frequency: 'daily',
      category: 'social',
      difficulty: 'easy',
      is_active: true,
      redirect_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      title: '完成加密貨幣測驗',
      description: '參加並通過我們的加密貨幣基礎知識測驗',
      reward_amount: 0.0001,
      reward_token: 'WBTC',
      task_type: 'quiz',
      frequency: 'once',
      category: 'achievement',
      difficulty: 'medium',
      is_active: true,
      redirect_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      title: '連接 LINE 錢包',
      description: '將您的 LINE 錢包連接到 ZOO3 平台',
      reward_amount: 3,
      reward_token: 'ZOO',
      task_type: 'connect_wallet',
      frequency: 'once',
      category: 'general',
      difficulty: 'easy',
      is_active: true,
      redirect_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '5',
      title: '訪問每個頁面',
      description: '訪問 ZOO3 平台的所有頁面',
      reward_amount: 1,
      reward_token: 'KAIA',
      task_type: 'visit_pages',
      frequency: 'once',
      category: 'general',
      difficulty: 'easy',
      is_active: true,
      redirect_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  users: [],
  user_profiles: [],
  task_completions: [],
  transactions: [],
  login_streaks: [],
  // 新增表格
  achievements: [
    {
      id: '1',
      title: '新手上路',
      description: '完成第一個任務',
      reward_amount: 10,
      reward_token: 'ZOO',
      required_progress: 1,
      achievement_type: 'task_completion',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: '任務達人',
      description: '完成 10 個任務',
      reward_amount: 50,
      reward_token: 'ZOO',
      required_progress: 10,
      achievement_type: 'task_completion',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      title: '連續登入 7 天',
      description: '連續 7 天登入並領取獎勵',
      reward_amount: 0.0001,
      reward_token: 'WBTC',
      required_progress: 7,
      achievement_type: 'login_streak',
      created_at: new Date().toISOString()
    }
  ],
  user_achievements: [],
  wallets: [],
  referrals: []
};

// API routes - Tasks
app.get('/api/tasks', (req, res) => {
  // Check if user is authenticated from Authorization header
  const authHeader = req.headers.authorization;
  let userId = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extract the token
    const token = authHeader.split(' ')[1];

    try {
      // Simple token decoding (for demo)
      userId = Buffer.from(token, 'base64').toString();
    } catch (error) {
      console.error('Token decoding error:', error);
    }
  }

  // If user is authenticated, add completion status to tasks
  if (userId) {
    const tasksWithStatus = db.tasks.map(task => {
      const completed = db.task_completions.some(
        tc => tc.user_id === userId && tc.task_id === task.id
      );

      return { ...task, completed };
    });

    return res.json({
      success: true,
      data: tasksWithStatus
    });
  }

  // Otherwise, return tasks without completion status
  res.json({
    success: true,
    data: db.tasks
  });
});

app.get('/api/tasks/:id', (req, res) => {
  const task = db.tasks.find(t => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: '找不到任務'
    });
  }

  res.json({
    success: true,
    data: task
  });
});

app.post('/api/tasks/:taskId/complete', (req, res) => {
  // Check if user is authenticated
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: '未授權'
    });
  }

  try {
    // Extract user ID from token
    const token = req.headers.authorization.split(' ')[1];
    const userId = Buffer.from(token, 'base64').toString();

    // Check if task exists
    const taskId = req.params.taskId;
    const task = db.tasks.find(t => t.id === taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: '找不到任務'
      });
    }

    // Check if task is already completed
    const alreadyCompleted = db.task_completions.some(
      tc => tc.user_id === userId && tc.task_id === taskId
    );

    if (alreadyCompleted) {
      return res.status(400).json({
        success: false,
        error: '您已經完成了這個任務'
      });
    }

    // Record task completion
    const completionId = Date.now().toString();
    const completion = {
      id: completionId,
      user_id: userId,
      task_id: taskId,
      completed_at: new Date().toISOString()
    };

    db.task_completions.push(completion);

    // Add transaction record
    const transactionId = Date.now().toString() + '1';
    const transaction = {
      id: transactionId,
      user_id: userId,
      amount: task.reward_amount,
      token: task.reward_token,
      transaction_type: 'task_reward',
      reference_id: taskId,
      description: `完成任務: ${task.title}`,
      created_at: new Date().toISOString()
    };

    db.transactions.push(transaction);

    // Update user profile balances
    const profile = db.user_profiles.find(p => p.user_id === userId);

    if (profile) {
      if (task.reward_token === 'KAIA') {
        profile.total_kaia += task.reward_amount;
      } else if (task.reward_token === 'ZOO') {
        profile.total_zoo += task.reward_amount;
      } else if (task.reward_token === 'WBTC') {
        profile.total_wbtc += task.reward_amount;
      }

      profile.total_tasks_completed += 1;
    }

    res.status(200).json({
      success: true,
      data: completion,
      message: '任務完成，獎勵已發放'
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({
      success: false,
      error: '完成任務時發生錯誤'
    });
  }
});

app.get('/api/tasks/user/completed', (req, res) => {
  // Check if user is authenticated
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: '未授權'
    });
  }

  try {
    // Extract user ID from token
    const token = req.headers.authorization.split(' ')[1];
    const userId = Buffer.from(token, 'base64').toString();

    // Get completed tasks
    const completedTasks = db.task_completions
      .filter(tc => tc.user_id === userId)
      .map(tc => {
        const task = db.tasks.find(t => t.id === tc.task_id);
        return {
          ...tc,
          title: task ? task.title : null,
          description: task ? task.description : null,
          reward_amount: task ? task.reward_amount : null,
          reward_token: task ? task.reward_token : null
        };
      });

    res.status(200).json({
      success: true,
      data: completedTasks
    });
  } catch (error) {
    console.error('Get completed tasks error:', error);
    res.status(500).json({
      success: false,
      error: '獲取已完成任務時發生錯誤'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, displayName, role } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: '請提供電子郵件和密碼'
    });
  }

  // Check if user already exists
  if (db.users.some(u => u.email === email)) {
    return res.status(400).json({
      success: false,
      error: '此電子郵件已被註冊'
    });
  }

  // Create user
  const userId = Date.now().toString();
  const user = {
    id: userId,
    email,
    password, // 在實際應用中應該加密密碼
    display_name: displayName || email.split('@')[0],
    role: role === 'admin' ? 'admin' : 'user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Create profile
  const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const profile = {
    id: Date.now().toString() + '1',
    user_id: userId,
    display_name: user.display_name,
    avatar_url: null,
    total_tasks_completed: 0,
    total_kaia: 0,
    total_zoo: 0,
    total_wbtc: 0,
    login_streak: 0,
    referral_code: referralCode,
    created_at: new Date().toISOString(),
    referral_count: 0
  };

  // Add to database
  db.users.push(user);
  db.user_profiles.push(profile);

  // Create login streak
  db.login_streaks.push({
    id: Date.now().toString() + '2',
    user_id: userId,
    streak_days: 0,
    current_day: 0,
    days_completed: [],
    created_at: new Date().toISOString()
  });

  // Generate token (simple for demo)
  const token = Buffer.from(userId).toString('base64');

  res.status(201).json({
    success: true,
    data: {
      user,
      profile,
      token
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: '請提供電子郵件和密碼'
    });
  }

  // Find user
  const user = db.users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({
      success: false,
      error: '電子郵件或密碼不正確'
    });
  }

  // Find profile
  const profile = db.user_profiles.find(p => p.user_id === user.id);

  // Generate token (simple for demo)
  const token = Buffer.from(user.id).toString('base64');

  res.json({
    success: true,
    data: {
      user,
      profile,
      token
    }
  });
});

// API routes - Rewards
app.get('/api/rewards/login-streak', (req, res) => {
  // Check if user is authenticated
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: '未授權'
    });
  }

  try {
    // Extract user ID from token
    const token = req.headers.authorization.split(' ')[1];
    const userId = Buffer.from(token, 'base64').toString();

    // Get login streak
    let streak = db.login_streaks.find(ls => ls.user_id === userId);

    // If no streak record exists, create one
    if (!streak) {
      streak = {
        id: Date.now().toString(),
        user_id: userId,
        streak_days: 0,
        current_day: 0,
        days_completed: [],
        created_at: new Date().toISOString()
      };

      db.login_streaks.push(streak);
    }

    // Format the response to match the frontend expectations
    const formattedStreak = {
      id: streak.id,
      userId: streak.user_id,
      streakDays: streak.streak_days,
      currentDay: streak.current_day,
      lastClaimedAt: streak.last_claimed_at,
      daysCompleted: streak.days_completed,
      days: [0, 1, 2, 3, 4, 5, 6].map(day => ({
        day: day + 1,
        completed: streak.days_completed.includes(day.toString())
      }))
    };

    // Check if today's reward is already claimed
    const today = new Date();
    const lastClaimed = streak.last_claimed_at ? new Date(streak.last_claimed_at) : null;

    const todaysClaimed = !!(lastClaimed &&
      lastClaimed.getDate() === today.getDate() &&
      lastClaimed.getMonth() === today.getMonth() &&
      lastClaimed.getFullYear() === today.getFullYear());

    res.status(200).json({
      success: true,
      data: {
        streak: formattedStreak,
        todaysClaimed
      }
    });
  } catch (error) {
    console.error('Get login streak error:', error);
    res.status(500).json({
      success: false,
      error: '獲取登入紀錄時發生錯誤'
    });
  }
});

app.post('/api/rewards/claim-daily', (req, res) => {
  // Check if user is authenticated
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: '未授權'
    });
  }

  try {
    // Extract user ID from token
    const token = req.headers.authorization.split(' ')[1];
    const userId = Buffer.from(token, 'base64').toString();

    // Get login streak
    let streak = db.login_streaks.find(ls => ls.user_id === userId);

    // If no streak record exists, create one
    if (!streak) {
      streak = {
        id: Date.now().toString(),
        user_id: userId,
        streak_days: 0,
        current_day: 0,
        days_completed: [],
        last_claimed_at: null,
        created_at: new Date().toISOString()
      };

      db.login_streaks.push(streak);
    }

    // Check if already claimed today
    const today = new Date();
    const lastClaimed = streak.last_claimed_at ? new Date(streak.last_claimed_at) : null;

    if (lastClaimed &&
        lastClaimed.getDate() === today.getDate() &&
        lastClaimed.getMonth() === today.getMonth() &&
        lastClaimed.getFullYear() === today.getFullYear()) {
      return res.status(400).json({
        success: false,
        error: '今日獎勵已領取'
      });
    }

    // Calculate streak
    let newStreakDays = streak.streak_days;
    let newCurrentDay = streak.current_day;
    let daysCompleted = streak.days_completed || [];

    // Check if streak is broken (more than 1 day since last claim)
    if (lastClaimed) {
      const daysSinceLastClaim = Math.floor((today.getTime() - lastClaimed.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceLastClaim > 1) {
        // Reset streak
        newStreakDays = 0;
        newCurrentDay = 0;
        daysCompleted = [];
      }
    }

    // Increment streak
    newStreakDays++;

    // Update current day (cycles 0-6)
    newCurrentDay = (newCurrentDay + 1) % 7;

    // Add current day to completed days
    daysCompleted.push(newCurrentDay.toString());

    // Determine reward amount (1 KAIA for regular days, 3 KAIA for day 7)
    const rewardAmount = newCurrentDay === 6 ? 3 : 1;

    // Update login streak
    streak.streak_days = newStreakDays;
    streak.current_day = newCurrentDay;
    streak.last_claimed_at = new Date().toISOString();
    streak.days_completed = daysCompleted;

    // Add transaction record
    const transactionId = Date.now().toString();
    const transaction = {
      id: transactionId,
      user_id: userId,
      amount: rewardAmount,
      token: 'KAIA',
      transaction_type: 'daily_reward',
      description: '每日簽到獎勵',
      created_at: new Date().toISOString()
    };

    db.transactions.push(transaction);

    // Update user profile
    const profile = db.user_profiles.find(p => p.user_id === userId);

    if (profile) {
      profile.total_kaia += rewardAmount;
      profile.last_login_date = new Date().toISOString();
      profile.login_streak = newStreakDays;
    }

    res.status(200).json({
      success: true,
      data: {
        reward: rewardAmount
      },
      message: '成功領取每日獎勵'
    });
  } catch (error) {
    console.error('Claim daily reward error:', error);
    res.status(500).json({
      success: false,
      error: '領取每日獎勵時發生錯誤'
    });
  }
});

app.get('/api/rewards/transactions', (req, res) => {
  // Check if user is authenticated
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: '未授權'
    });
  }

  try {
    // Extract user ID from token
    const token = req.headers.authorization.split(' ')[1];
    const userId = Buffer.from(token, 'base64').toString();

    // Get user transactions
    const transactions = db.transactions
      .filter(t => t.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Get user transactions error:', error);
    res.status(500).json({
      success: false,
      error: '獲取交易紀錄時發生錯誤'
    });
  }
});

// API routes - User Profile
app.get('/api/users/profile', (req, res) => {
  // Check if user is authenticated
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: '未授權'
    });
  }

  try {
    // Extract user ID from token
    const token = req.headers.authorization.split(' ')[1];
    const userId = Buffer.from(token, 'base64').toString();

    // Get user profile
    const profile = db.user_profiles.find(p => p.user_id === userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: '找不到用戶資料'
      });
    }

    // Calculate referral count
    const referralCount = db.referrals.filter(r => r.referrer_id === userId).length;

    // Add referral count to profile
    const profileWithReferrals = {
      ...profile,
      referral_count: referralCount
    };

    res.status(200).json({
      success: true,
      data: profileWithReferrals
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: '獲取用戶資料時發生錯誤'
    });
  }
});

app.put('/api/users/profile', (req, res) => {
  // Check if user is authenticated
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: '未授權'
    });
  }

  try {
    // Extract user ID from token
    const token = req.headers.authorization.split(' ')[1];
    const userId = Buffer.from(token, 'base64').toString();

    const { display_name, avatar_url } = req.body;

    // Get user profile
    const profile = db.user_profiles.find(p => p.user_id === userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: '找不到用戶資料'
      });
    }

    // Update profile
    if (display_name !== undefined) {
      profile.display_name = display_name;
    }

    if (avatar_url !== undefined) {
      profile.avatar_url = avatar_url;
    }

    res.status(200).json({
      success: true,
      data: profile,
      message: '用戶資料已更新'
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      error: '更新用戶資料時發生錯誤'
    });
  }
});

// API routes - Admin
// 獲取儀表板概覽
app.get('/api/admin/dashboard/overview', authenticateAdmin, (req, res) => {
  try {
    const totalUsers = db.users.length;
    const totalTasks = db.tasks.length;
    const activeTasks = db.tasks.filter(t => t.is_active).length;
    const totalCompletions = db.task_completions.length;

    // 計算每個代幣的總發放量
    const totalRewards = {
      KAIA: 0,
      ZOO: 0,
      WBTC: 0
    };

    db.transactions.forEach(tx => {
      if (tx.token === 'KAIA') totalRewards.KAIA += parseFloat(tx.amount);
      if (tx.token === 'ZOO') totalRewards.ZOO += parseFloat(tx.amount);
      if (tx.token === 'WBTC') totalRewards.WBTC += parseFloat(tx.amount);
    });

    // 獲取最近的交易
    const recentTransactions = db.transactions
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    // 獲取最近的用戶
    const recentUsers = db.users
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map(user => {
        const profile = db.user_profiles.find(p => p.user_id === user.id);
        return {
          id: user.id,
          email: user.email,
          display_name: user.display_name,
          created_at: user.created_at,
          total_tasks_completed: profile ? profile.total_tasks_completed : 0
        };
      });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalTasks,
        activeTasks,
        totalCompletions,
        totalRewards,
        recentTransactions,
        recentUsers
      }
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      error: '獲取儀表板數據時發生錯誤'
    });
  }
});

// 獲取所有用戶
app.get('/api/admin/users', authenticateAdmin, (req, res) => {
  try {
    const users = db.users.map(user => {
      const profile = db.user_profiles.find(p => p.user_id === user.id);
      return {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        role: user.role || 'user',
        created_at: user.created_at,
        updated_at: user.updated_at,
        profile: profile || null
      };
    });

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      error: '獲取用戶列表時發生錯誤'
    });
  }
});

// 更新用戶資料
app.put('/api/admin/users/:id/profile', authenticateAdmin, (req, res) => {
  try {
    const userId = req.params.id;
    const { display_name, avatar_url, role } = req.body;

    // 檢查用戶是否存在
    const user = db.users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: '找不到用戶'
      });
    }

    // 更新用戶資料
    if (display_name !== undefined) {
      user.display_name = display_name;
    }

    if (role !== undefined) {
      user.role = role;
    }

    user.updated_at = new Date().toISOString();

    // 更新用戶資料
    const profile = db.user_profiles.find(p => p.user_id === userId);

    if (profile) {
      if (display_name !== undefined) {
        profile.display_name = display_name;
      }

      if (avatar_url !== undefined) {
        profile.avatar_url = avatar_url;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        profile
      },
      message: '用戶資料已更新'
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      error: '更新用戶資料時發生錯誤'
    });
  }
});

// 更新用戶狀態
app.put('/api/admin/users/:id/status', authenticateAdmin, (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;

    // 檢查用戶是否存在
    const user = db.users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: '找不到用戶'
      });
    }

    // 更新用戶狀態
    user.status = status;
    user.updated_at = new Date().toISOString();

    res.status(200).json({
      success: true,
      data: user,
      message: '用戶狀態已更新'
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      error: '更新用戶狀態時發生錯誤'
    });
  }
});

// 獲取所有任務（包括非活躍）
app.get('/api/admin/tasks', authenticateAdmin, (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: db.tasks
    });
  } catch (error) {
    console.error('Get admin tasks error:', error);
    res.status(500).json({
      success: false,
      error: '獲取任務列表時發生錯誤'
    });
  }
});

// 創建新任務
app.post('/api/admin/tasks', authenticateAdmin, (req, res) => {
  try {
    const {
      title,
      description,
      reward_amount,
      reward_token,
      task_type,
      frequency,
      category,
      difficulty,
      is_active,
      redirect_url
    } = req.body;

    // 簡單驗證
    if (!title || !reward_amount || !reward_token || !task_type) {
      return res.status(400).json({
        success: false,
        error: '請提供必要的任務資訊'
      });
    }

    // 創建任務
    const taskId = Date.now().toString();
    const now = new Date().toISOString();

    const task = {
      id: taskId,
      title,
      description: description || '',
      reward_amount: parseFloat(reward_amount),
      reward_token,
      task_type,
      frequency: frequency || 'once',
      category: category || 'general',
      difficulty: difficulty || 'easy',
      is_active: is_active !== undefined ? is_active : true,
      redirect_url: redirect_url || null,
      created_at: now,
      updated_at: now
    };

    db.tasks.push(task);

    res.status(201).json({
      success: true,
      data: task,
      message: '任務已創建'
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      error: '創建任務時發生錯誤'
    });
  }
});

// 更新任務
app.put('/api/admin/tasks/:id', authenticateAdmin, (req, res) => {
  try {
    const taskId = req.params.id;
    const {
      title,
      description,
      reward_amount,
      reward_token,
      task_type,
      frequency,
      category,
      difficulty,
      is_active,
      redirect_url
    } = req.body;

    // 檢查任務是否存在
    const taskIndex = db.tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '找不到任務'
      });
    }

    // 更新任務
    const task = db.tasks[taskIndex];

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (reward_amount !== undefined) task.reward_amount = parseFloat(reward_amount);
    if (reward_token !== undefined) task.reward_token = reward_token;
    if (task_type !== undefined) task.task_type = task_type;
    if (frequency !== undefined) task.frequency = frequency;
    if (category !== undefined) task.category = category;
    if (difficulty !== undefined) task.difficulty = difficulty;
    if (is_active !== undefined) task.is_active = is_active;
    if (redirect_url !== undefined) task.redirect_url = redirect_url;

    task.updated_at = new Date().toISOString();

    res.status(200).json({
      success: true,
      data: task,
      message: '任務已更新'
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      error: '更新任務時發生錯誤'
    });
  }
});

// 刪除任務（設為非活躍）
app.delete('/api/admin/tasks/:id', authenticateAdmin, (req, res) => {
  try {
    const taskId = req.params.id;

    // 檢查任務是否存在
    const taskIndex = db.tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '找不到任務'
      });
    }

    // 將任務設為非活躍
    db.tasks[taskIndex].is_active = false;
    db.tasks[taskIndex].updated_at = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: '任務已下架'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      error: '刪除任務時發生錯誤'
    });
  }
});

// API routes - Blockchain
// 連接錢包
app.post('/api/blockchain/connect-wallet', authenticateUser, (req, res) => {
  try {
    const userId = req.userId;
    const { wallet_address } = req.body;

    // 簡單驗證
    if (!wallet_address) {
      return res.status(400).json({
        success: false,
        error: '請提供錢包地址'
      });
    }

    // 檢查錢包是否已經連接到其他用戶
    const existingWallet = db.wallets.find(w => w.wallet_address === wallet_address && w.user_id !== userId);

    if (existingWallet) {
      return res.status(400).json({
        success: false,
        error: '此錢包地址已被其他用戶使用'
      });
    }

    // 檢查用戶是否已經連接錢包
    let wallet = db.wallets.find(w => w.user_id === userId);

    if (wallet) {
      // 更新錢包地址
      wallet.wallet_address = wallet_address;
      wallet.updated_at = new Date().toISOString();
    } else {
      // 創建新錢包記錄
      wallet = {
        id: Date.now().toString(),
        user_id: userId,
        wallet_address,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      db.wallets.push(wallet);
    }

    // 檢查是否有連接錢包的任務
    const connectWalletTask = db.tasks.find(t => t.task_type === 'connect_wallet' && t.is_active);

    if (connectWalletTask) {
      // 檢查用戶是否已經完成此任務
      const alreadyCompleted = db.task_completions.some(
        tc => tc.user_id === userId && tc.task_id === connectWalletTask.id
      );

      if (!alreadyCompleted) {
        // 記錄任務完成
        const completionId = Date.now().toString();
        const completion = {
          id: completionId,
          user_id: userId,
          task_id: connectWalletTask.id,
          completed_at: new Date().toISOString()
        };

        db.task_completions.push(completion);

        // 添加交易記錄
        const transactionId = Date.now().toString() + '1';
        const transaction = {
          id: transactionId,
          user_id: userId,
          amount: connectWalletTask.reward_amount,
          token: connectWalletTask.reward_token,
          transaction_type: 'task_reward',
          reference_id: connectWalletTask.id,
          description: `完成任務: ${connectWalletTask.title}`,
          created_at: new Date().toISOString()
        };

        db.transactions.push(transaction);

        // 更新用戶資料
        const profile = db.user_profiles.find(p => p.user_id === userId);

        if (profile) {
          if (connectWalletTask.reward_token === 'KAIA') {
            profile.total_kaia += connectWalletTask.reward_amount;
          } else if (connectWalletTask.reward_token === 'ZOO') {
            profile.total_zoo += connectWalletTask.reward_amount;
          } else if (connectWalletTask.reward_token === 'WBTC') {
            profile.total_wbtc += connectWalletTask.reward_amount;
          }

          profile.total_tasks_completed += 1;
        }

        res.status(200).json({
          success: true,
          data: {
            wallet,
            task_completed: true,
            reward: {
              amount: connectWalletTask.reward_amount,
              token: connectWalletTask.reward_token
            }
          },
          message: '錢包已連接並獲得獎勵'
        });
      } else {
        res.status(200).json({
          success: true,
          data: {
            wallet,
            task_completed: false
          },
          message: '錢包已連接'
        });
      }
    } else {
      res.status(200).json({
        success: true,
        data: {
          wallet,
          task_completed: false
        },
        message: '錢包已連接'
      });
    }
  } catch (error) {
    console.error('Connect wallet error:', error);
    res.status(500).json({
      success: false,
      error: '連接錢包時發生錯誤'
    });
  }
});

// 獲取用戶錢包
app.get('/api/blockchain/wallet', authenticateUser, (req, res) => {
  try {
    const userId = req.userId;

    // 獲取用戶錢包
    const wallet = db.wallets.find(w => w.user_id === userId);

    if (!wallet) {
      return res.status(404).json({
        success: false,
        error: '找不到錢包資訊'
      });
    }

    res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({
      success: false,
      error: '獲取錢包資訊時發生錯誤'
    });
  }
});

// 同步代幣餘額
app.post('/api/blockchain/sync-balances', authenticateUser, (req, res) => {
  try {
    const userId = req.userId;

    // 獲取用戶資料
    const profile = db.user_profiles.find(p => p.user_id === userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: '找不到用戶資料'
      });
    }

    // 計算用戶的代幣餘額
    let totalKaia = 0;
    let totalZoo = 0;
    let totalWbtc = 0;

    db.transactions
      .filter(tx => tx.user_id === userId)
      .forEach(tx => {
        if (tx.token === 'KAIA') totalKaia += parseFloat(tx.amount);
        if (tx.token === 'ZOO') totalZoo += parseFloat(tx.amount);
        if (tx.token === 'WBTC') totalWbtc += parseFloat(tx.amount);
      });

    // 更新用戶資料
    profile.total_kaia = totalKaia;
    profile.total_zoo = totalZoo;
    profile.total_wbtc = totalWbtc;

    res.status(200).json({
      success: true,
      data: {
        balances: {
          KAIA: totalKaia,
          ZOO: totalZoo,
          WBTC: totalWbtc
        }
      },
      message: '代幣餘額已同步'
    });
  } catch (error) {
    console.error('Sync balances error:', error);
    res.status(500).json({
      success: false,
      error: '同步代幣餘額時發生錯誤'
    });
  }
});

// 獲取代幣餘額
app.get('/api/blockchain/balance/:token', authenticateUser, (req, res) => {
  try {
    const userId = req.userId;
    const token = req.params.token.toUpperCase();

    // 驗證代幣類型
    if (!['KAIA', 'ZOO', 'WBTC'].includes(token)) {
      return res.status(400).json({
        success: false,
        error: '無效的代幣類型'
      });
    }

    // 獲取用戶資料
    const profile = db.user_profiles.find(p => p.user_id === userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: '找不到用戶資料'
      });
    }

    // 獲取代幣餘額
    let balance = 0;

    if (token === 'KAIA') balance = profile.total_kaia;
    if (token === 'ZOO') balance = profile.total_zoo;
    if (token === 'WBTC') balance = profile.total_wbtc;

    res.status(200).json({
      success: true,
      data: {
        token,
        balance
      }
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      success: false,
      error: '獲取代幣餘額時發生錯誤'
    });
  }
});

// 轉賬代幣
app.post('/api/blockchain/transfer', authenticateUser, (req, res) => {
  try {
    const userId = req.userId;
    const { recipient_address, amount, token } = req.body;

    // 簡單驗證
    if (!recipient_address || !amount || !token) {
      return res.status(400).json({
        success: false,
        error: '請提供收款地址、金額和代幣類型'
      });
    }

    // 驗證代幣類型
    if (!['KAIA', 'ZOO', 'WBTC'].includes(token)) {
      return res.status(400).json({
        success: false,
        error: '無效的代幣類型'
      });
    }

    // 獲取用戶資料
    const profile = db.user_profiles.find(p => p.user_id === userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: '找不到用戶資料'
      });
    }

    // 檢查餘額
    let balance = 0;

    if (token === 'KAIA') balance = profile.total_kaia;
    if (token === 'ZOO') balance = profile.total_zoo;
    if (token === 'WBTC') balance = profile.total_wbtc;

    if (balance < parseFloat(amount)) {
      return res.status(400).json({
        success: false,
        error: '餘額不足'
      });
    }

    // 添加交易記錄
    const transactionId = Date.now().toString();
    const transaction = {
      id: transactionId,
      user_id: userId,
      amount: -parseFloat(amount),
      token,
      transaction_type: 'transfer',
      reference_id: recipient_address,
      description: `轉賬 ${amount} ${token} 到 ${recipient_address}`,
      created_at: new Date().toISOString()
    };

    db.transactions.push(transaction);

    // 更新用戶資料
    if (token === 'KAIA') profile.total_kaia -= parseFloat(amount);
    if (token === 'ZOO') profile.total_zoo -= parseFloat(amount);
    if (token === 'WBTC') profile.total_wbtc -= parseFloat(amount);

    res.status(200).json({
      success: true,
      data: {
        transaction_id: transactionId,
        new_balance: token === 'KAIA' ? profile.total_kaia : token === 'ZOO' ? profile.total_zoo : profile.total_wbtc
      },
      message: '轉賬成功'
    });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({
      success: false,
      error: '轉賬時發生錯誤'
    });
  }
});

// 獲取交易記錄
app.get('/api/blockchain/transactions', authenticateUser, (req, res) => {
  try {
    const userId = req.userId;
    const { token, limit = 10, offset = 0 } = req.query;

    // 獲取用戶交易記錄
    let transactions = db.transactions.filter(tx => tx.user_id === userId);

    // 如果指定了代幣類型，則過濾
    if (token) {
      transactions = transactions.filter(tx => tx.token === token.toUpperCase());
    }

    // 按時間排序
    transactions = transactions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // 分頁
    const paginatedTransactions = transactions.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        transactions: paginatedTransactions,
        total: transactions.length
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      error: '獲取交易記錄時發生錯誤'
    });
  }
});

// API routes - Social
// 獲取推薦連結
app.get('/api/social/referral-link', authenticateUser, (req, res) => {
  try {
    const userId = req.userId;

    // 獲取用戶資料
    const profile = db.user_profiles.find(p => p.user_id === userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: '找不到用戶資料'
      });
    }

    // 如果用戶沒有推薦碼，則生成一個
    if (!profile.referral_code) {
      profile.referral_code = Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    // 生成推薦連結
    const referralLink = `https://zoo3.app/register?ref=${profile.referral_code}`;

    res.status(200).json({
      success: true,
      data: {
        referral_code: profile.referral_code,
        referral_link: referralLink
      }
    });
  } catch (error) {
    console.error('Get referral link error:', error);
    res.status(500).json({
      success: false,
      error: '獲取推薦連結時發生錯誤'
    });
  }
});

// 獲取推薦統計
app.get('/api/social/referral-stats', authenticateUser, (req, res) => {
  try {
    const userId = req.userId;

    // 獲取用戶的推薦記錄
    const referrals = db.referrals.filter(r => r.referrer_id === userId);

    // 計算總獎勵
    let totalRewards = {
      KAIA: 0,
      ZOO: 0,
      WBTC: 0
    };

    db.transactions
      .filter(tx => tx.user_id === userId && tx.transaction_type === 'referral_reward')
      .forEach(tx => {
        if (tx.token === 'KAIA') totalRewards.KAIA += parseFloat(tx.amount);
        if (tx.token === 'ZOO') totalRewards.ZOO += parseFloat(tx.amount);
        if (tx.token === 'WBTC') totalRewards.WBTC += parseFloat(tx.amount);
      });

    // 獲取被推薦用戶的資料
    const referredUsers = referrals.map(r => {
      const user = db.users.find(u => u.id === r.referee_id);
      const profile = user ? db.user_profiles.find(p => p.user_id === user.id) : null;

      return {
        id: r.id,
        referee_id: r.referee_id,
        referee_name: user ? user.display_name : '未知用戶',
        reward_claimed: r.reward_claimed,
        created_at: r.created_at
      };
    });

    res.status(200).json({
      success: true,
      data: {
        total_referrals: referrals.length,
        total_rewards: totalRewards,
        referrals: referredUsers
      }
    });
  } catch (error) {
    console.error('Get referral stats error:', error);
    res.status(500).json({
      success: false,
      error: '獲取推薦統計時發生錯誤'
    });
  }
});

// 推薦新用戶
app.post('/api/social/refer', (req, res) => {
  try {
    const { referral_code, new_user_id } = req.body;

    // 簡單驗證
    if (!referral_code || !new_user_id) {
      return res.status(400).json({
        success: false,
        error: '請提供推薦碼和新用戶 ID'
      });
    }

    // 檢查推薦碼是否有效
    const referrerProfile = db.user_profiles.find(p => p.referral_code === referral_code);

    if (!referrerProfile) {
      return res.status(400).json({
        success: false,
        error: '無效的推薦碼'
      });
    }

    // 檢查新用戶是否存在
    const newUser = db.users.find(u => u.id === new_user_id);

    if (!newUser) {
      return res.status(400).json({
        success: false,
        error: '找不到新用戶'
      });
    }

    // 檢查新用戶是否已經被推薦
    const existingReferral = db.referrals.find(r => r.referee_id === new_user_id);

    if (existingReferral) {
      return res.status(400).json({
        success: false,
        error: '此用戶已經被推薦'
      });
    }

    // 檢查用戶是否推薦自己
    if (referrerProfile.user_id === new_user_id) {
      return res.status(400).json({
        success: false,
        error: '不能推薦自己'
      });
    }

    // 創建推薦記錄
    const referralId = Date.now().toString();
    const referral = {
      id: referralId,
      referrer_id: referrerProfile.user_id,
      referee_id: new_user_id,
      reward_claimed: true,
      created_at: new Date().toISOString()
    };

    db.referrals.push(referral);

    // 給推薦人獎勵
    const referrerRewardAmount = 10;
    const referrerTransactionId = Date.now().toString() + '1';
    const referrerTransaction = {
      id: referrerTransactionId,
      user_id: referrerProfile.user_id,
      amount: referrerRewardAmount,
      token: 'ZOO',
      transaction_type: 'referral_reward',
      reference_id: referralId,
      description: '推薦新用戶獎勵',
      created_at: new Date().toISOString()
    };

    db.transactions.push(referrerTransaction);

    // 更新推薦人資料
    referrerProfile.total_zoo += referrerRewardAmount;

    // 給被推薦人獎勵
    const refereeRewardAmount = 5;
    const refereeTransactionId = Date.now().toString() + '2';
    const refereeTransaction = {
      id: refereeTransactionId,
      user_id: new_user_id,
      amount: refereeRewardAmount,
      token: 'ZOO',
      transaction_type: 'referral_reward',
      reference_id: referralId,
      description: '使用推薦碼獎勵',
      created_at: new Date().toISOString()
    };

    db.transactions.push(refereeTransaction);

    // 更新被推薦人資料
    const refereeProfile = db.user_profiles.find(p => p.user_id === new_user_id);

    if (refereeProfile) {
      refereeProfile.total_zoo += refereeRewardAmount;
    }

    res.status(200).json({
      success: true,
      data: {
        referral,
        referrer_reward: {
          amount: referrerRewardAmount,
          token: 'ZOO'
        },
        referee_reward: {
          amount: refereeRewardAmount,
          token: 'ZOO'
        }
      },
      message: '推薦成功，獎勵已發放'
    });
  } catch (error) {
    console.error('Refer user error:', error);
    res.status(500).json({
      success: false,
      error: '推薦用戶時發生錯誤'
    });
  }
});

// API routes - Achievements
// 獲取所有成就
app.get('/api/achievements', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: db.achievements
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      error: '獲取成就列表時發生錯誤'
    });
  }
});

// 獲取用戶成就
app.get('/api/achievements/user', authenticateUser, (req, res) => {
  try {
    const userId = req.userId;

    // 獲取用戶成就
    const userAchievements = db.user_achievements.filter(ua => ua.user_id === userId);

    // 獲取用戶資料
    const profile = db.user_profiles.find(p => p.user_id === userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: '找不到用戶資料'
      });
    }

    // 計算成就進度
    const achievementsWithProgress = db.achievements.map(achievement => {
      // 查找用戶是否已解鎖此成就
      const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id);

      // 計算當前進度
      let currentProgress = 0;

      if (achievement.achievement_type === 'task_completion') {
        // 任務完成類型的成就
        currentProgress = profile.total_tasks_completed;
      } else if (achievement.achievement_type === 'login_streak') {
        // 連續登入類型的成就
        currentProgress = profile.login_streak;
      }

      return {
        ...achievement,
        unlocked: !!userAchievement,
        unlocked_at: userAchievement ? userAchievement.unlocked_at : null,
        current_progress: currentProgress,
        progress_percentage: Math.min(100, Math.floor((currentProgress / achievement.required_progress) * 100))
      };
    });

    res.status(200).json({
      success: true,
      data: achievementsWithProgress
    });
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({
      success: false,
      error: '獲取用戶成就時發生錯誤'
    });
  }
});

// 領取成就獎勵
app.post('/api/achievements/:id/claim', authenticateUser, (req, res) => {
  try {
    const userId = req.userId;
    const achievementId = req.params.id;

    // 檢查成就是否存在
    const achievement = db.achievements.find(a => a.id === achievementId);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: '找不到成就'
      });
    }

    // 檢查用戶是否已經領取過此成就
    const existingAchievement = db.user_achievements.find(
      ua => ua.user_id === userId && ua.achievement_id === achievementId
    );

    if (existingAchievement) {
      return res.status(400).json({
        success: false,
        error: '您已經領取過此成就獎勵'
      });
    }

    // 獲取用戶資料
    const profile = db.user_profiles.find(p => p.user_id === userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: '找不到用戶資料'
      });
    }

    // 檢查用戶是否達到成就要求
    let currentProgress = 0;

    if (achievement.achievement_type === 'task_completion') {
      // 任務完成類型的成就
      currentProgress = profile.total_tasks_completed;
    } else if (achievement.achievement_type === 'login_streak') {
      // 連續登入類型的成就
      currentProgress = profile.login_streak;
    }

    if (currentProgress < achievement.required_progress) {
      return res.status(400).json({
        success: false,
        error: '尚未達到成就要求'
      });
    }

    // 記錄成就解鎖
    const userAchievementId = Date.now().toString();
    const userAchievement = {
      id: userAchievementId,
      user_id: userId,
      achievement_id: achievementId,
      unlocked_at: new Date().toISOString()
    };

    db.user_achievements.push(userAchievement);

    // 添加交易記錄
    const transactionId = Date.now().toString() + '1';
    const transaction = {
      id: transactionId,
      user_id: userId,
      amount: achievement.reward_amount,
      token: achievement.reward_token,
      transaction_type: 'achievement_reward',
      reference_id: achievementId,
      description: `成就獎勵: ${achievement.title}`,
      created_at: new Date().toISOString()
    };

    db.transactions.push(transaction);

    // 更新用戶資料
    if (achievement.reward_token === 'KAIA') {
      profile.total_kaia += achievement.reward_amount;
    } else if (achievement.reward_token === 'ZOO') {
      profile.total_zoo += achievement.reward_amount;
    } else if (achievement.reward_token === 'WBTC') {
      profile.total_wbtc += achievement.reward_amount;
    }

    res.status(200).json({
      success: true,
      data: {
        achievement: userAchievement,
        reward: {
          amount: achievement.reward_amount,
          token: achievement.reward_token
        }
      },
      message: '成就獎勵已領取'
    });
  } catch (error) {
    console.error('Claim achievement error:', error);
    res.status(500).json({
      success: false,
      error: '領取成就獎勵時發生錯誤'
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '歡迎使用 ZOO3 API',
    documentation: '/api-docs',
    version: '1.0.0',
    endpoints: {
      tasks: '/api/tasks',
      auth: '/api/auth',
      users: '/api/users',
      rewards: '/api/rewards',
      blockchain: '/api/blockchain',
      social: '/api/social',
      achievements: '/api/achievements',
      admin: '/api/admin'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/tasks`);
});
