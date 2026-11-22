# 一键构建：生成开发用自签名证书 -> 签清单 -> 导出公钥证书 -> 打包 NSIS 安装包
# 注意：证书密码不写入仓库；temp.pfx 已被 .gitignore 忽略，仅用于本地开发。

Param(
    [string]$PfxPath = (Join-Path $PSScriptRoot 'temp.pfx'),
    [string]$PfxPassword,
    [string]$NsisPath = 'C:\Program Files (x86)\NSIS\makensis.exe'
)

if (-not $PfxPassword) {
    $PfxPassword = Read-Host -Prompt '请输入临时证书密码（仅本机使用，不写入仓库）'
}
if (-not $PfxPassword) { throw '必须提供证书密码' }

$secure = ConvertTo-SecureString $PfxPassword -AsPlainText -Force
$cert = New-SelfSignedCertificate -Subject 'CN=AI Pilot for WPS Word Temp' -CertStoreLocation 'Cert:\CurrentUser\My' -KeyExportPolicy Exportable -KeySpec Signature -NotAfter (Get-Date).AddYears(5) -KeyAlgorithm RSA -KeyLength 2048
Export-PfxCertificate -Cert $cert -FilePath $PfxPath -Password $secure -Force
Write-Host "PFX exported to $PfxPath（密码仅本机持有，请勿提交）"

& "$PSScriptRoot\sign-manifest.ps1" -ManifestPath "$PSScriptRoot\dist\manifest.xml" -PfxPath $PfxPath -PfxPassword $PfxPassword
Write-Host 'Manifest signed'

$pfx = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($PfxPath, $PfxPassword)
[System.IO.File]::WriteAllBytes("$PSScriptRoot\dist\manifest.cer", $pfx.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert))
Write-Host 'Public cert exported to dist\manifest.cer'

& $NsisPath "$PSScriptRoot\wps-gift-installer.nsi"
Write-Host 'NSIS build finished'
