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
      redirect_url: 'https://discord.gg/zoo3',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: '社交媒體分享',
      description: '在您的社交媒體帳戶上分享 ZOO3',
      reward_amount: 5,
      reward_token: 'ZOO',
      task_type: 'social_share',
      redirect_url: null,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      title: '完成加密貨幣測驗',
      description: '參加並通過我們的加密貨幣基礎知識測驗',
      reward_amount: 0.0001,
      reward_token: 'WBTC',
      task_type: 'quiz',
      redirect_url: null,
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      title: '連接 LINE 錢包',
      description: '將您的 LINE 錢包連接到 ZOO3 平台',
      reward_amount: 3,
      reward_token: 'ZOO',
      task_type: 'connect_wallet',
      redirect_url: null,
      created_at: new Date().toISOString()
    },
    {
      id: '5',
      title: '訪問每個頁面',
      description: '訪問 ZOO3 平台的所有頁面',
      reward_amount: 1,
      reward_token: 'KAIA',
      task_type: 'visit_pages',
      redirect_url: null,
      created_at: new Date().toISOString()
    }
  ],
  users: [],
  user_profiles: [],
  task_completions: [],
  transactions: [],
  login_streaks: []
};

// API routes
app.get('/api/tasks', (req, res) => {
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

app.post('/api/auth/register', (req, res) => {
  const { email, password, displayName } = req.body;

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
    display_name: displayName || email.split('@')[0],
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/tasks`);
});
