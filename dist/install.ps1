Param(
    [string]$TargetDir = "$env:LOCALAPPDATA\WPSAddins\AI_Pilot_for_WPS_Word",
    [switch]$Force
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$distDir = $scriptDir

Write-Host "安装目录： $TargetDir"

# 创建目标目录并复制文件（排除安装器自身）
New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
Get-ChildItem -Path $distDir -Recurse | ForEach-Object {
    $rel = $_.FullName.Substring($distDir.Length).TrimStart('\')
    if ($rel -eq '') { return }
    if ($rel -match 'install.ps1' -or $rel -match 'uninstall.ps1' -or $rel -match 'README_INSTALL.md') { return }
    $dest = Join-Path $TargetDir $rel
    if ($_.PSIsContainer) { New-Item -ItemType Directory -Path $dest -Force | Out-Null } else { Copy-Item -Path $_.FullName -Destination $dest -Force }
}

Write-Host "文件已复制到 $TargetDir"

try {
    # 生成自签名证书并导出公钥到 manifest.cer
    $subject = "CN=AI Pilot for WPS Word"
    $cert = New-SelfSignedCertificate -Subject $subject -CertStoreLocation "Cert:\CurrentUser\My" -KeyExportPolicy Exportable -NotAfter (Get-Date).AddYears(10)
    $cerPath = Join-Path $TargetDir "manifest.cer"
    Export-Certificate -Cert $cert -FilePath $cerPath -Force | Out-Null

    # 导入到当前用户受信任根
    Import-Certificate -FilePath $cerPath -CertStoreLocation Cert:\CurrentUser\Root | Out-Null
    Write-Host "证书已导入到 当前用户 -> 受信任的根证书颁发机构"
} catch {
    Write-Host "证书生成/导入时发生错误： $_" -ForegroundColor Red
}

# 打开目标文件夹并选中 manifest.xml，便于用户在 WPS 中加载
$manifestPath = Join-Path $TargetDir "manifest.xml"
if (Test-Path $manifestPath) {
    Start-Process explorer.exe -ArgumentList "/select,`"$manifestPath`""
    Write-Host "安装完成：请在 WPS -> 工具 -> 加载项 -> XML 扩展包 中选择以下 manifest 并加载：`n$manifestPath"
} else {
    Write-Host "安装完成，但未找到 manifest.xml：$manifestPath" -ForegroundColor Yellow
}

Write-Host "若要以命令行方式运行此脚本：`nPowerShell -ExecutionPolicy Bypass -File install.ps1`n"
