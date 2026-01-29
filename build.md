# Wstart 编译发布指南

本文档详细介绍了如何编译和发布 Wstart 项目。

## 前置条件

在开始编译之前，您需要确保已安装以下软件：

1. **Node.js** (v16.0.0 或更高版本)
   - 下载地址：https://nodejs.org/
   - 安装完成后，运行 `node -v` 验证安装成功

2. **Rust** 和 **Cargo**
   - 下载地址：https://www.rust-lang.org/tools/install
   - 安装完成后，运行 `rustc --version` 和 `cargo --version` 验证安装成功

3. **Git** (可选)
   - 下载地址：https://git-scm.com/downloads
   - 用于克隆代码仓库

## 编译步骤

### 1. 克隆代码仓库

如果您还没有代码仓库，请先克隆：

```bash
git clone https://github.com/imlgmcom/WStart.git
cd WStart
```

### 2. 安装依赖

运行以下命令安装项目依赖：

```bash
npm install
```

### 3. 重建原生模块

使用 electron-rebuild 重建原生模块：

```bash
npm run rebuild
```

### 4. 编译 Rust 代码

编译 Rust 代码生成 addon.node 文件：

```bash
npm run rsbuild
```

### 5. 构建项目

构建前端资源和 Electron 进程：

```bash
npm run build
```

### 6. 打包发布

打包 Windows 版本：

```bash
npx electron-builder --win dir
```

打包完成后，应用程序将输出到 `release/{version}/win-unpacked` 目录。

### 7. 打包成 ZIP 文件

将打包好的应用程序压缩成 ZIP 文件，方便分发：

```bash
# 使用 PowerShell 压缩成 ZIP 文件
powershell Compress-Archive -Path "release\$(node -p "require('./package.json').version")\win-unpacked" -DestinationPath "release\Wstart-$(node -p "require('./package.json').version")-Windows.zip"
```

或者使用 7-Zip（如果已安装）：

```bash
7z a "release\Wstart-$(node -p "require('./package.json').version")-Windows.zip" "release\$(node -p "require('./package.json').version")\win-unpacked"
```

## 快捷编译脚本

项目根目录提供了一个快捷编译脚本 `build-release.ps1`，您可以直接运行它来执行所有编译步骤：

```powershell
powershell -ExecutionPolicy Bypass -File build-release.ps1
```

## 常见问题

### 1. 找不到 addon.node 模块

**问题原因**：Rust 代码没有被编译成 addon.node 文件。

**解决方案**：确保执行了 `npm run rsbuild` 命令，该命令会编译 Rust 代码并生成 addon.node 文件。

### 2. 文件被占用，无法删除

**问题原因**：Wstart 进程正在运行，占用了打包所需的文件。

**解决方案**：先终止所有正在运行的 Wstart.exe 进程，然后再重新打包：

```bash
taskkill /F /IM Wstart.exe
```

### 3. 编译失败，提示缺少依赖

**问题原因**：项目依赖没有正确安装。

**解决方案**：重新运行 `npm install` 命令，确保所有依赖都已安装。

## 技术栈

- **前端**：Electron + Vite + Vue3 + TypeScript
- **后端**：Rust
- **数据库**：SQLite3

## 支持平台

- Windows 10/11

## 联系方式

如果您在编译过程中遇到任何问题，请联系项目维护者。

- GitHub 仓库：https://github.com/imlgmcom/WStart