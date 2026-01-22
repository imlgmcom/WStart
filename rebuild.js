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
  // 从 package.json 中获取 Electron 版本
  const pkg = require('./package.json');
  const electronVersion = pkg.devDependencies.electron.replace('^', '').replace('~', '');
  
  console.log(`使用 Electron 版本 ${electronVersion} 重建原生模块...`);
  
  // 执行 electron-rebuild 命令，使用 --yes 自动确认安装，重建所有原生模块
  execSync(
    `npx --yes electron-rebuild -v ${electronVersion} -f -w better-sqlite3-multiple-ciphers`,
    { stdio: 'inherit' }
  );
  
  console.log('electron-rebuild 成功完成！');
  process.exit(0);
} catch (error) {
  console.error('electron-rebuild 失败:', error.message);
  process.exit(1);
}
