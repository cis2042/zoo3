# ZOO3 平台技術文檔

ZOO3 是一個基於區塊鏈的任務獎勵平台，用戶可以完成各種任務來獲取代幣獎勵。平台支持多種任務類型、成就系統和社交推薦功能，並與 LINE Wallet 集成以提供無縫的用戶體驗。

![ZOO3 Platform](https://raw.githubusercontent.com/cis2042/v0-line-ui-development/main/public/images/lion-logo.png)

## 演示

您可以通過以下鏈接訪問 ZOO3 平台的演示版本：

🔗 [ZOO3 演示](https://cis2042.github.io/zoo3-5v/demo)

> **注意**：演示版本僅展示 UI 界面，實際功能需要連接到後端服務。

## 目錄

- [演示](#演示)
- [技術棧](#技術棧)
- [系統架構](#系統架構)
- [快速開始](#快速開始)
- [資料庫結構](#資料庫結構)
- [API 文檔](#api-文檔)
- [試用帳號](#試用帳號)
- [功能特點](#功能特點)

## 技術棧

### 前端
- **框架**: React 18
- **構建工具**: Vite
- **狀態管理**: React Context API
- **UI 庫**: Tailwind CSS, shadcn/ui
- **HTTP 客戶端**: Axios
- **路由**: React Router
- **類型檢查**: TypeScript
- **區塊鏈集成**: Web3.js
- **LINE 集成**: LINE LIFF SDK

### 後端
- **運行環境**: Node.js
- **框架**: Express.js
- **數據庫**: PostgreSQL
- **ORM**: 原生 SQL 查詢
- **認證**: JWT, LINE 認證
- **API 文檔**: Swagger/OpenAPI
- **區塊鏈集成**: Web3.js
- **任務調度**: Node-cron

## 系統架構

```
+------------------+      +------------------+      +------------------+
|                  |      |                  |      |                  |
|  Frontend        |      |  Backend         |      |  Database        |
|  (React + Vite)  +----->+  (Node.js)       +----->+  (PostgreSQL)    |
|  localhost:3011  |      |  localhost:8080  |      |  localhost:5432  |
|                  |      |                  |      |                  |
+------------------+      +------------------+      +------------------+
         |                        |
         |                        |
         v                        v
+------------------+      +------------------+
|                  |      |                  |
|  LINE LIFF       |      |  Blockchain      |
|  Integration     |      |  Integration     |
|                  |      |                  |
+------------------+      +------------------+
```

### 系統組件

1. **前端應用**
   - 用戶界面和交互
   - LINE 登錄集成
   - 任務列表和完成界面
   - 錢包連接和代幣管理
   - 管理員後台

2. **後端服務**
   - RESTful API
   - 用戶認證和授權
   - 任務管理
   - 獎勵發放
   - 數據庫交互

3. **數據庫**
   - 用戶數據
   - 任務數據
   - 交易記錄
   - 成就和進度追蹤

4. **外部集成**
   - LINE 登錄和 LINE Wallet
   - 區塊鏈交互
   - 代幣合約

## 快速開始

### 前提條件
- Node.js 18+
- PostgreSQL 14+
- npm 或 yarn

### 安裝和運行

1. **克隆倉庫**
   ```bash
   git clone https://github.com/cis2042/zoo3.git
   cd zoo3
   ```

2. **設置環境變量**

   創建 `server/.env` 文件:
   ```
   PORT=8080
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   PGHOST=localhost
   PGUSER=postgres
   PGDATABASE=zoo3_db
   PGPASSWORD=postgres
   PGPORT=5432
   LIFF_ID=1234567890-abcdefgh
   FRONTEND_URL=http://localhost:3011
   ```

   創建 `client/.env` 文件:
   ```
   VITE_API_URL=http://localhost:8080/api
   VITE_LIFF_ID=1234567890-abcdefgh
   ```

3. **安裝依賴**
   ```bash
   # 安裝後端依賴
   cd server
   npm install

   # 安裝前端依賴
   cd ../client
   npm install
   ```

4. **初始化數據庫**
   ```bash
   cd ../server
   node src/db/init.js
   ```

5. **啟動服務**
   ```bash
   # 啟動後端服務
   cd ../server
   npm run dev

   # 啟動前端服務
   cd ../client
   npm run dev
   ```

6. **訪問應用**
   - 前端: http://localhost:3011
   - 後端 API: http://localhost:8080/api
   - 管理員後台: http://localhost:3011/admin/dashboard

## 資料庫結構

### 主要表格

1. **users** - 用戶信息
   - `id` (VARCHAR) - 主鍵
   - `line_user_id` (VARCHAR) - LINE 用戶 ID
   - `role` (VARCHAR) - 用戶角色 (user/admin)
   - `created_at` (TIMESTAMP) - 創建時間
   - `updated_at` (TIMESTAMP) - 更新時間

2. **user_profiles** - 用戶資料
   - `user_id` (VARCHAR) - 外鍵關聯 users.id
   - `display_name` (VARCHAR) - 顯示名稱
   - `avatar_url` (TEXT) - 頭像 URL
   - `referral_code` (VARCHAR) - 推薦碼
   - `total_kaia` (DECIMAL) - KAIA 代幣餘額
   - `total_zoo` (DECIMAL) - ZOO 代幣餘額
   - `total_wbtc` (DECIMAL) - WBTC 代幣餘額
   - `total_tasks_completed` (INTEGER) - 完成任務總數
   - `login_streak` (INTEGER) - 連續登錄天數
   - `last_login_date` (TIMESTAMP) - 最後登錄日期

3. **tasks** - 任務信息
   - `id` (VARCHAR) - 主鍵
   - `title` (VARCHAR) - 任務標題
   - `description` (TEXT) - 任務描述
   - `reward_amount` (DECIMAL) - 獎勵金額
   - `reward_token` (VARCHAR) - 獎勵代幣類型
   - `task_type` (VARCHAR) - 任務類型
   - `frequency` (VARCHAR) - 頻率
   - `category` (VARCHAR) - 類別
   - `difficulty` (VARCHAR) - 難度
   - `is_active` (BOOLEAN) - 是否活躍
   - `created_at` (TIMESTAMP) - 創建時間
   - `updated_at` (TIMESTAMP) - 更新時間

4. **task_completions** - 任務完成記錄
   - `id` (VARCHAR) - 主鍵
   - `user_id` (VARCHAR) - 外鍵關聯 users.id
   - `task_id` (VARCHAR) - 外鍵關聯 tasks.id
   - `completed_at` (TIMESTAMP) - 完成時間

5. **transactions** - 交易記錄
   - `id` (VARCHAR) - 主鍵
   - `user_id` (VARCHAR) - 外鍵關聯 users.id
   - `amount` (DECIMAL) - 金額
   - `token` (VARCHAR) - 代幣類型
   - `transaction_type` (VARCHAR) - 交易類型
   - `reference_id` (VARCHAR) - 參考 ID
   - `description` (TEXT) - 描述
   - `created_at` (TIMESTAMP) - 創建時間

### 其他表格

- **achievements** - 成就信息
- **user_achievements** - 用戶成就進度
- **wallets** - 用戶錢包信息
- **referrals** - 推薦記錄
- **task_progress** - 任務進度追蹤

## API 文檔

API 文檔使用 Swagger UI 實現，可以通過以下地址訪問：

- **Swagger UI**: http://localhost:8080/api-docs

### 認證 API

- `POST /api/auth/register` - 註冊新用戶
- `POST /api/auth/login` - 用戶登錄
- `GET /api/auth/me` - 獲取當前用戶信息

### 任務 API

- `GET /api/tasks` - 獲取所有任務
- `GET /api/tasks/:id` - 獲取特定任務
- `POST /api/tasks/:id/complete` - 完成任務
- `GET /api/tasks/daily` - 獲取每日任務
- `GET /api/tasks/chains` - 獲取任務鏈
- `POST /api/tasks/chains/subtask/:id/complete` - 完成子任務

### 成就 API

- `GET /api/achievements` - 獲取所有成就
- `GET /api/achievements/user` - 獲取用戶成就
- `POST /api/achievements/:id/claim` - 領取成就獎勵

### 社交 API

- `GET /api/social/referral-link` - 獲取推薦連結
- `GET /api/social/referral-stats` - 獲取推薦統計
- `POST /api/social/refer` - 推薦新用戶

### 區塊鏈 API

- `POST /api/blockchain/connect-wallet` - 連接錢包
- `GET /api/blockchain/wallet` - 獲取用戶錢包
- `POST /api/blockchain/sync-balances` - 同步代幣餘額
- `GET /api/blockchain/balance/:token` - 獲取代幣餘額
- `POST /api/blockchain/transfer` - 轉賬代幣
- `GET /api/blockchain/transactions` - 獲取交易記錄

### 管理員 API

- `GET /api/admin/dashboard/overview` - 獲取儀表板概覽
- `GET /api/admin/users` - 獲取所有用戶
- `PUT /api/admin/users/:id/profile` - 更新用戶資料
- `PUT /api/admin/users/:id/status` - 更新用戶狀態
- `GET /api/admin/tasks` - 獲取所有任務（包括非活躍）
- `POST /api/admin/tasks` - 創建新任務
- `PUT /api/admin/tasks/:id` - 更新任務
- `DELETE /api/admin/tasks/:id` - 刪除任務（設為非活躍）

## 試用帳號

由於系統使用 LINE 登錄，在本地開發環境中，我們提供了一個模擬的 LINE 登錄流程：

### 普通用戶
- **用戶名**: user@example.com
- **密碼**: password123

### 管理員
- **用戶名**: admin@example.com
- **密碼**: admin123

### 模擬 LINE 登錄

1. 訪問 http://localhost:3011/mock-line-login
2. 輸入測試帳號的用戶名和密碼
3. 點擊「模擬 LINE 登錄」按鈕
4. 系統將自動生成一個模擬的 LINE 用戶資料並完成登錄

### 測試錢包

為了測試區塊鏈功能，您可以使用以下測試錢包地址：

- **測試錢包地址**: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F

連接錢包後，系統將自動為您分配一些測試代幣。

## 功能特點

1. **用戶認證**
   - LINE 登錄集成
   - JWT 令牌認證
   - 令牌刷新機制

2. **任務系統**
   - 多種任務類型（標準、每日、任務鏈）
   - 任務進度追蹤
   - 任務完成獎勵

3. **成就系統**
   - 多種成就類型
   - 成就進度追蹤
   - 成就獎勵

4. **社交功能**
   - 用戶推薦系統
   - 推薦獎勵
   - 推薦統計

5. **區塊鏈集成**
   - 錢包連接
   - 代幣餘額查詢
   - 代幣轉賬
   - 交易記錄

6. **管理員後台**
   - 儀表板統計
   - 用戶管理
   - 任務管理
   - 數據分析

















