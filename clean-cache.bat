@echo off
echo ====================================
echo 清理 Next.js 缓存
echo ====================================
echo.

cd /d "C:\Users\77132\Desktop\测试词汇量"

echo 1. 清理 .next 构建目录...
if exist .next (
    rmdir /s /q .next
    echo ✅ 已删除 .next 目录
) else (
    echo ℹ️  .next 目录不存在
)

echo.
echo 2. 清理 node_modules 缓存...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✅ 已清理 node_modules 缓存
) else (
    echo ℹ️  node_modules 缓存不存在
)

echo.
echo 3. 清理 TypeScript 缓存...
if exist node_modules\.tsbuildinfo (
    del /q node_modules\.tsbuildinfo 2>nul
    echo ✅ 已清理 TypeScript 缓存
)

echo.
echo ✅ 清理完成！
echo 现在运行：npm run build
echo ====================================
pause