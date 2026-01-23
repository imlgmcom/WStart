# 构建发布脚本
Write-Host "开始构建发布..." -ForegroundColor Green

# 安装依赖
Write-Host "安装依赖..." -ForegroundColor Yellow
npm install

# 重新编译native模块
Write-Host "重新编译native模块..." -ForegroundColor Yellow
npm run rebuild

# 构建项目
Write-Host "构建项目..." -ForegroundColor Yellow
npm run build

# 打包发布
Write-Host "打包发布..." -ForegroundColor Yellow
npx electron-builder --win dir

Write-Host "构建完成！" -ForegroundColor Green