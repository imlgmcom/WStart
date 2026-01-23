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
  // 首先检查 electron 是否安装成功
  console.log('检查 electron 安装状态...');
  execSync('npx electron --version', { stdio: 'inherit' });
  
  // 使用 electron --version 获取实际安装的 Electron 版本
  let electronVersion = execSync('npx electron --version', { encoding: 'utf8' }).trim();
  // 移除 'v' 前缀，例如将 'v28.3.1' 转换为 '28.3.1'
  electronVersion = electronVersion.replace('v', '');
  
  console.log(`使用 Electron 版本 ${electronVersion} 重建原生模块...`);
  
  // 获取当前架构
  const arch = process.arch;
  console.log(`当前架构: ${arch}`);
  
  // 获取当前平台
  const platform = process.platform;
  console.log(`当前平台: ${platform}`);
  
  // 输出 node 版本信息
  console.log('Node.js 版本:');
  execSync('node --version', { stdio: 'inherit' });
  
  console.log('npm 版本:');
  execSync('npm --version', { stdio: 'inherit' });
  
  // 执行 electron-rebuild 命令，使用最基本的参数，确保在所有环境中都能正确工作
  // 不使用 --with-electron-version，而是使用 -v 参数
  // 不使用 --arch，让 electron-rebuild 自动检测
  // 明确指定要构建的模块
  console.log('执行 electron-rebuild 命令...');
  execSync(
    `npx --yes electron-rebuild -v ${electronVersion} --force --module-dir ./`,
    { stdio: 'inherit' }
  );
  
  console.log('electron-rebuild 成功完成！');
  process.exit(0);
} catch (error) {
  console.error('electron-rebuild 失败:', error.message);
  process.exit(1);
}
