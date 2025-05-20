# ZOO3 平台技術文檔

ZOO3 是一個基於區塊鏈的任務獎勵平台，用戶可以完成各種任務來獲取代幣獎勵。平台支持多種任務類型、成就系統和社交推薦功能，並與 LINE Wallet 集成以提供無縫的用戶體驗。

## 目錄

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
