@echo off
chcp 65001 >nul
echo ========================================
echo 日本語語彙力診断 - 安装和启动脚本
echo ========================================
echo.

echo [1/2] 正在安装依赖包...
call npm install
if errorlevel 1 (
    echo.
    echo 安装失败！请检查网络连接和Node.js是否正确安装。
    pause
    exit /b 1
)

echo.
echo [2/2] 正在启动开发服务器...
echo.
echo 服务器启动后，请在浏览器中访问: http://localhost:3000
echo 按 Ctrl+C 可以停止服务器
echo.
call npm run dev

pause
