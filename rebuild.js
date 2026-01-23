// 使用 electron-rebuild 工具来重建所有原生模块
const { execSync } = require('child_process');
const fs = require('fs');

console.log('开始使用 electron-rebuild 重建原生模块...');

// 清理旧的构建文件
const nativeDir = './native';
if (fs.existsSync(nativeDir)) {
  console.log('清理旧的 native 目录...');
  fs.rmSync(nativeDir, { recursive: true, force: true });
  console.log('旧的 native 目录已清理');
}

// 执行 electron-rebuild 命令
try {
  // 使用 electron --version 获取实际安装的 Electron 版本
  let electronVersion = execSync('npx electron --version', { encoding: 'utf8' }).trim();
  // 移除 'v' 前缀，例如将 'v28.3.1' 转换为 '28.3.1'
  electronVersion = electronVersion.replace('v', '');
  
  console.log(`使用 Electron 版本 ${electronVersion} 重建原生模块...`);
  
  // 获取当前架构
  const arch = process.arch;
  console.log(`当前架构: ${arch}`);
  
  // 执行 electron-rebuild 命令，明确指定所有参数，确保使用正确的 Electron 版本和头文件
  // --with-electron-version: 指定 Electron 版本
  // --arch: 指定架构
  // --dist-url: 指定 Electron 头文件下载地址
  // --force: 强制重新构建
  // --yes: 自动确认安装
  execSync(
    `npx --yes electron-rebuild --with-electron-version ${electronVersion} --arch ${arch} --dist-url https://electronjs.org/headers --force`,
    { stdio: 'inherit' }
  );
  
  console.log('electron-rebuild 成功完成！');
  process.exit(0);
} catch (error) {
  console.error('electron-rebuild 失败:', error.message);
  process.exit(1);
}
