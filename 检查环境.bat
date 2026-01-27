@echo off
chcp 65001 >nul
echo ========================================
echo 环境检查脚本
echo ========================================
echo.

echo [检查 1] Node.js 版本：
node --version
if errorlevel 1 (
    echo ❌ Node.js 未安装！
    echo.
    echo 请访问 https://nodejs.org/ 下载并安装 Node.js
    echo 建议安装 LTS 版本（长期支持版本）
    echo.
) else (
    echo ✅ Node.js 已安装
    echo.
)

echo [检查 2] npm 版本：
npm --version
if errorlevel 1 (
    echo ❌ npm 未安装！
    echo.
    echo npm 通常随 Node.js 一起安装
    echo 如果 Node.js 已安装但 npm 不可用，请重新安装 Node.js
    echo.
) else (
    echo ✅ npm 已安装
    echo.
)

echo ========================================
echo 检查完成！
echo ========================================
echo.
pause
