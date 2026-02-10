Param(
    [string]$TargetDir = "$env:LOCALAPPDATA\WPSAddins\AI_Pilot_for_WPS_Word",
    [switch]$Force
)

Write-Host "卸载目标： $TargetDir"

try {
    # 从受信任根和个人存储中删除匹配的证书
    $matches = Get-ChildItem Cert:\CurrentUser\Root | Where-Object { $_.Subject -like '*AI Pilot for WPS Word*' }
    foreach ($c in $matches) { Remove-Item -Path ("Cert:\CurrentUser\Root\" + $c.Thumbprint) -Force -ErrorAction SilentlyContinue }

    $matches2 = Get-ChildItem Cert:\CurrentUser\My | Where-Object { $_.Subject -like '*AI Pilot for WPS Word*' }
    foreach ($c in $matches2) { Remove-Item -Path ("Cert:\CurrentUser\My\" + $c.Thumbprint) -Force -ErrorAction SilentlyContinue }

    Write-Host "相关证书已从当前用户证书存储中删除（如存在）"
} catch {
    Write-Host "删除证书时出错： $_" -ForegroundColor Yellow
}

if (Test-Path $TargetDir) {
    Remove-Item -Path $TargetDir -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "已删除目录： $TargetDir"
} else { Write-Host "未找到安装目录： $TargetDir" }

Write-Host "卸载完成。"
