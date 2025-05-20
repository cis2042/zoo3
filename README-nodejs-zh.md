# ZOO3 平台 - Node.js 版本

這是 ZOO3 平台的 Node.js 版本，使用 Express 作為後端，React 作為前端，PostgreSQL 作為資料庫。

## 技術棧

### 前端
- React
- React Router
- Tailwind CSS
- shadcn/ui 元件
- LINE LIFF SDK

### 後端
- Node.js
- Express
- PostgreSQL
- JWT 認證

## 專案結構

```
/
├── client/                  # 前端 React 應用
│   ├── public/              # 靜態資源
│   │   └── images/          # 圖像資源
│   └── src/                 # 源代碼
│       ├── components/      # React 元件
│       ├── context/         # React Context
│       ├── hooks/           # 自定義 Hooks
│       ├── lib/             # 工具函數
│       ├── pages/           # 頁面元件
│       └── types/           # TypeScript 類型定義
├── server/                  # 後端 Node.js 應用
│   ├── src/                 # 源代碼
│   │   ├── controllers/     # 控制器
│   │   ├── db/              # 資料庫相關
│   │   ├── middleware/      # 中間件
│   │   ├── routes/          # 路由
│   │   ├── services/        # 服務
│   │   └── types/           # TypeScript 類型定義
│   └── .env                 # 環境變數
└── start.sh                 # 啟動腳本
```

## 安裝與運行

### 前提條件

- Node.js 16+
- PostgreSQL 12+（可選，預設使用記憶體資料庫）

### 資料庫設置（可選）

1. 創建 PostgreSQL 資料庫：

```bash
createdb zoo3_db
```

2. 配置資料庫連接：

編輯 `server/.env` 文件，設置正確的資料庫連接信息，並將 `USE_IN_MEMORY_DB` 設置為 `false`：

```
USE_IN_MEMORY_DB=false
PGHOST=localhost
PGUSER=postgres
PGDATABASE=zoo3_db
PGPASSWORD=postgres
PGPORT=5432
```

### 安裝依賴

1. 安裝後端依賴：

```bash
cd server
npm install
```

2. 安裝前端依賴：

```bash
cd client
npm install
```

### 運行應用

使用啟動腳本同時啟動前端和後端：

```bash
./start.sh
```

或者分別啟動：

1. 啟動後端：

```bash
cd server
npm run dev
```

2. 啟動前端：

```bash
cd client
npm run dev
```

前端將在 http://localhost:3000 運行（如果端口被佔用，會自動選擇下一個可用端口），後端將在 http://localhost:8080 運行。

## 功能

- 用戶認證（註冊、登入）
- LINE LIFF 整合
- 任務系統
- 獎勵系統
- 每日登入獎勵
- 推薦系統
- 成就系統

## 環境變數

### 後端 (.env)

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
