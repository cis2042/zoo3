#!/bin/bash

# 刪除可能存在的鎖文件
rm -f .git/index.lock

# 初始化 Git 倉庫
git init

# 添加所有文件
git add .

# 提交代碼
git commit -m "Initial commit: ZOO3 platform with Node.js backend and React frontend"

# 添加遠程倉庫
git remote add origin https://github.com/cis2042/zoo3.git

# 設置主分支名稱
git branch -M main

# 推送到 GitHub
git push -u origin main

echo "Git 設置完成！"
