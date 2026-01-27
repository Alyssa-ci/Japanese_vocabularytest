@echo off
chcp 65001 >nul
echo ========================================
echo 修复 PowerShell 执行策略
echo ========================================
echo.
echo 正在修改 PowerShell 执行策略以允许运行 npm 脚本...
echo.

powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"

if errorlevel 1 (
    echo.
    echo ❌ 修改失败！可能需要管理员权限
    echo.
    echo 请尝试以下方法：
    echo 1. 右键点击 Cursor，选择"以管理员身份运行"
    echo 2. 或者在 PowerShell（管理员）中运行：
    echo    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
    echo.
) else (
    echo.
    echo ✅ 执行策略已修改成功！
    echo.
    echo 现在可以正常使用 npm 命令了
    echo.
)

echo ========================================
pause
