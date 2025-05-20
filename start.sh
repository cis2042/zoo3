#!/bin/bash

# 確保我們在正確的目錄中
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 啟動後端服務器
cd server
echo "正在啟動後端服務器..."
npm run dev &
SERVER_PID=$!

# 等待後端啟動
sleep 2
echo "後端服務器已啟動，可通過 http://localhost:8080 訪問"

# 啟動前端開發服務器
cd "$SCRIPT_DIR/client"
echo "正在啟動前端開發服務器..."
npm run dev &
CLIENT_PID=$!

# 等待前端啟動
sleep 2
echo "前端開發服務器已啟動，請在瀏覽器中訪問顯示的 URL"
echo "提示：如果前端端口被佔用，Vite 會自動選擇下一個可用端口"

# 捕獲 SIGINT 信號 (Ctrl+C)
trap "kill $SERVER_PID $CLIENT_PID; exit" SIGINT

# 保持腳本運行
echo "按 Ctrl+C 停止所有服務器"
wait
