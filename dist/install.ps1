Param(
    [string]$TargetDir = "$env:LOCALAPPDATA\WPSAddins\AI_Pilot_for_WPS_Word",
    [switch]$Force
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$distDir = $scriptDir

Write-Host "Installing to: $TargetDir"

# 鍒涘缓鐩爣鐩綍骞跺鍒舵枃浠讹紙鎺掗櫎瀹夎鍣ㄨ嚜韬級
New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
Get-ChildItem -Path $distDir -Recurse | ForEach-Object {
    $rel = $_.FullName.Substring($distDir.Length).TrimStart('\')
    if ($rel -eq '') { return }
    if ($rel -match 'install.ps1' -or $rel -match 'uninstall.ps1' -or $rel -match 'README_INSTALL.md') { return }
    $dest = Join-Path $TargetDir $rel
    if ($_.PSIsContainer) { New-Item -ItemType Directory -Path $dest -Force | Out-Null } else { Copy-Item -Path $_.FullName -Destination $dest -Force }
}

Write-Host "Files copied to $TargetDir"

try {
    # 鐢熸垚鑷鍚嶈瘉涔﹀苟瀵煎嚭鍏挜鍒?manifest.cer
    $subject = "CN=AI Pilot for WPS Word"
    $cert = New-SelfSignedCertificate -Subject $subject -CertStoreLocation "Cert:\CurrentUser\My" -KeyExportPolicy Exportable -NotAfter (Get-Date).AddYears(10)
    $cerPath = Join-Path $TargetDir "manifest.cer"
    Export-Certificate -Cert $cert -FilePath $cerPath -Force | Out-Null

    # Import certificate into CurrentUser Root
    Import-Certificate -FilePath $cerPath -CertStoreLocation Cert:\CurrentUser\Root | Out-Null
    Write-Host "Certificate imported into CurrentUser\Root"
} catch {
    Write-Host "Error generating/importing certificate: $_" -ForegroundColor Red
}

# 鎵撳紑鐩爣鏂囦欢澶瑰苟閫変腑 manifest.xml锛屼究浜庣敤鎴峰湪 WPS 涓姞杞?
$manifestPath = Join-Path $TargetDir "manifest.xml"
if (Test-Path $manifestPath) {
    Start-Process explorer.exe -ArgumentList "/select,`"$manifestPath`""
    Write-Host "Installation complete. Please open WPS -> Tools -> Add-ins -> XML Extension Package and load the following manifest:`n$manifestPath"
} else {
    Write-Host "Installation complete, but manifest.xml not found: $manifestPath" -ForegroundColor Yellow
}

Write-Host "To run this script from command line:`nPowerShell -ExecutionPolicy Bypass -File install.ps1`n"
