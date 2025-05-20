import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// In-memory database for demo purposes
class InMemoryDB {
  private data: Record<string, any[]> = {
    users: [],
    user_profiles: [],
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
    task_completions: [],
    transactions: [],
    referrals: [],
    login_streaks: [],
    achievements: []
  };

  async query(text: string, params: any[] = []) {
    console.log('In-memory DB query:', text, params);

    // Simple query parser for demo purposes
    if (text.toLowerCase().includes('select * from tasks')) {
      return { rows: this.data.tasks, rowCount: this.data.tasks.length };
    }

    if (text.toLowerCase().includes('select * from user_profiles')) {
      const userId = params[0];
      const profile = this.data.user_profiles.find(p => p.user_id === userId);
      return { rows: profile ? [profile] : [], rowCount: profile ? 1 : 0 };
    }

    // Default response
    return { rows: [], rowCount: 0 };
  }

  async connect() {
    return {
      query: async (text: string, params: any[] = []) => this.query(text, params),
      release: () => {}
    };
  }
}

// Determine which database to use
const useInMemoryDB = process.env.USE_IN_MEMORY_DB === 'true';

let db: Pool | InMemoryDB;

if (useInMemoryDB) {
  console.log('Using in-memory database for demo purposes');
  db = new InMemoryDB() as any;
} else {
  // Create a new PostgreSQL connection pool
  db = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: parseInt(process.env.PGPORT || '5432'),
  });

  // Test the database connection
  db.connect((err, client, release) => {
    if (err) {
      console.error('Error connecting to the database:', err);
    } else {
      console.log('Successfully connected to PostgreSQL database');
      release();
    }
  });
}

export default db;
