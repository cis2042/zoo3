# ZOO3 平台 - Node.js 版本

这是 ZOO3 平台的 Node.js 版本，使用 Express 作为后端，React 作为前端，PostgreSQL 作为数据库。

## 技术栈

### 前端
- React
- React Router
- Tailwind CSS
- shadcn/ui 组件
- LINE LIFF SDK

### 后端
- Node.js
- Express
- PostgreSQL
- JWT 认证

## 项目结构

```
/
├── client/                  # 前端 React 应用
│   ├── public/              # 静态资源
│   │   └── images/          # 图像资源
│   └── src/                 # 源代码
│       ├── components/      # React 组件
│       ├── context/         # React Context
│       ├── hooks/           # 自定义 Hooks
│       ├── lib/             # 工具函数
│       ├── pages/           # 页面组件
│       └── types/           # TypeScript 类型定义
├── server/                  # 后端 Node.js 应用
│   ├── src/                 # 源代码
│   │   ├── controllers/     # 控制器
│   │   ├── db/              # 数据库相关
│   │   ├── middleware/      # 中间件
│   │   ├── routes/          # 路由
│   │   ├── services/        # 服务
│   │   └── types/           # TypeScript 类型定义
│   └── .env                 # 环境变量
└── start.sh                 # 启动脚本
```

## 安装与运行

### 前提条件

- Node.js 16+
- PostgreSQL 12+

### 数据库设置

1. 创建 PostgreSQL 数据库：

```bash
createdb zoo3_db
```

2. 配置数据库连接：

编辑 `server/.env` 文件，设置正确的数据库连接信息：

```
PGHOST=localhost
PGUSER=postgres
PGDATABASE=zoo3_db
PGPASSWORD=postgres
PGPORT=5432
```

3. 初始化数据库：

```bash
cd server
npx ts-node src/db/setup.ts
```

### 安装依赖

1. 安装后端依赖：

```bash
cd server
npm install
```

2. 安装前端依赖：

```bash
cd client
npm install
```

### 运行应用

使用启动脚本同时启动前端和后端：

```bash
./start.sh
```

或者分别启动：

1. 启动后端：

```bash
cd server
npm run dev
```

2. 启动前端：

```bash
cd client
npm run dev
```

前端将在 http://localhost:3000 运行（如果端口被占用，会自动选择下一个可用端口），后端将在 http://localhost:8080 运行。

## 功能

- 用户认证（注册、登录）
- LINE LIFF 集成
- 任务系统
- 奖励系统
- 每日登录奖励
- 推荐系统
- 成就系统

## 环境变量

### 后端 (.env)

```
PORT=8080
NODE_ENV=development
USE_IN_MEMORY_DB=true
PGHOST=localhost
PGUSER=postgres
PGDATABASE=zoo3_db
PGPASSWORD=postgres
PGPORT=5432
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
LIFF_ID=1234567890-abcdefgh
KAIA_RPC_URL=https://rpc.kaiachain.io
WBTC_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

### 前端 (.env)

```
VITE_API_URL=http://localhost:8080/api
VITE_LIFF_ID=1234567890-abcdefgh
```
