# 解决 PowerShell 执行策略问题

## 问题说明

你遇到的错误是因为 Windows PowerShell 默认禁止运行脚本，这是 Windows 的安全策略。

错误信息：
```
无法加载文件 D:\tools\npm.ps1，因为在此系统上禁止运行脚本
```

## 解决方案（三种方法）

### 方法一：修改 PowerShell 执行策略（推荐）

1. **使用修复脚本**：
   - 双击运行 `修复PowerShell策略.bat`
   - 脚本会自动修改执行策略

2. **或者手动修改**：
   - 在 Cursor 终端中输入：
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
   - 输入 `Y` 确认

3. **重启 Cursor**，然后重新尝试 npm 命令

### 方法二：使用 CMD 模式启动（最简单）

直接双击运行 `使用CMD启动.bat`，这个脚本会：
- 使用 CMD 而不是 PowerShell
- 自动安装依赖
- 启动开发服务器

**这是最简单的方法，不需要修改任何设置！**

### 方法三：在 CMD 中运行

1. 按 `Win + R`，输入 `cmd`，回车
2. 进入项目目录：
   ```cmd
   cd "c:\Users\77132\Desktop\测试词汇量"
   ```
3. 运行命令：
   ```cmd
   npm install
   npm run dev
   ```

## 推荐操作

**最简单的方式**：直接双击运行 `使用CMD启动.bat`，无需修改任何设置！

---

## 验证是否解决

修改后，在 Cursor 终端中运行：
```bash
npm --version
```

如果显示版本号（如 `10.x.x`），说明问题已解决。
