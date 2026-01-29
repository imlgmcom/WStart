# ���������ű�
Write-Host "��ʼ��������..." -ForegroundColor Green

# ��װ����
Write-Host "��װ����..." -ForegroundColor Yellow
npm install

# ���±���nativeģ��
Write-Host "���±���nativeģ��..." -ForegroundColor Yellow
npm run rebuild

# ����Rust��������addon.node
Write-Host "����Rust��������addon.node..." -ForegroundColor Yellow
npm run rsbuild

# ������Ŀ
Write-Host "������Ŀ..." -ForegroundColor Yellow
npm run build

# �������
Write-Host "�������..." -ForegroundColor Yellow
npx electron-builder --win dir

# ����� ZIP �ļ�
Write-Host "����� ZIP �ļ�..." -ForegroundColor Yellow
$version = (Get-Content -Path package.json -Raw | ConvertFrom-Json).version
$sourcePath = "release\$version\win-unpacked"
$destinationPath = "release\Wstart-$version-Windows.zip"

if (Test-Path $sourcePath) {
    Compress-Archive -Path $sourcePath -DestinationPath $destinationPath -Force
    Write-Host "ZIP �ļ������ɣ�$destinationPath" -ForegroundColor Green
} else {
    Write-Host "�����Ҳ���ԴĿ¼ $sourcePath" -ForegroundColor Red
}

Write-Host "������ɣ�" -ForegroundColor Green