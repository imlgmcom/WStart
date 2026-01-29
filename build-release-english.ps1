# Build Release Script
Write-Host "Starting build release..." -ForegroundColor Green

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Rebuild native modules
Write-Host "Rebuilding native modules..." -ForegroundColor Yellow
npm run rebuild

# Compile Rust code
Write-Host "Compiling Rust code..." -ForegroundColor Yellow
npm run rsbuild

# Build project
Write-Host "Building project..." -ForegroundColor Yellow
npm run build

# Package release
Write-Host "Packaging release..." -ForegroundColor Yellow
npx electron-builder --win dir

# Package into ZIP file
Write-Host "Packaging into ZIP file..." -ForegroundColor Yellow
$version = (Get-Content -Path package.json -Raw | ConvertFrom-Json).version
$sourcePath = "release\$version\win-unpacked"
$destinationPath = "release\Wstart-$version-Windows.zip"

if (Test-Path $sourcePath) {
    Compress-Archive -Path $sourcePath -DestinationPath $destinationPath -Force
    Write-Host "ZIP file generated: $destinationPath" -ForegroundColor Green
} else {
    Write-Host "Error: Source directory not found: $sourcePath" -ForegroundColor Red
}

Write-Host "Build completed!" -ForegroundColor Green