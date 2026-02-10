$pwd = ConvertTo-SecureString 'P@ssw0rd!' -Force -AsPlainText
$cert = New-SelfSignedCertificate -Subject 'CN=AI Pilot for WPS Word Temp' -CertStoreLocation 'Cert:\CurrentUser\My' -KeyExportPolicy Exportable -KeySpec Signature -NotAfter (Get-Date).AddYears(5) -KeyAlgorithm RSA -KeyLength 2048
Export-PfxCertificate -Cert $cert -FilePath "$PSScriptRoot\temp.pfx" -Password $pwd -Force
Write-Host 'PFX exported to temp.pfx'

PowerShell -NoProfile -ExecutionPolicy Bypass -File "$PSScriptRoot\sign-manifest.ps1" -ManifestPath "$PSScriptRoot\dist\manifest.xml" -PfxPath "$PSScriptRoot\temp.pfx" -PfxPassword 'P@ssw0rd!'
Write-Host 'Manifest signed'

$pfx = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2("$PSScriptRoot\temp.pfx",'P@ssw0rd!')
[System.IO.File]::WriteAllBytes("$PSScriptRoot\dist\manifest.cer", $pfx.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert))
Write-Host 'Public cert exported to dist\manifest.cer'

& 'C:\Program Files (x86)\NSIS\makensis.exe' "$PSScriptRoot\wps-gift-installer.nsi"
Write-Host 'NSIS build finished'
