Param(
    [string]$ManifestPath = "dist\manifest.xml",
    [string]$PfxPath,
    [string]$PfxPassword
)

if (-not (Test-Path $ManifestPath)) { Write-Error "Manifest not found: $ManifestPath"; exit 1 }
if (-not (Test-Path $PfxPath)) { Write-Error "PFX not found: $PfxPath"; exit 1 }

[xml]$xmlDoc = Get-Content -Raw -Path $ManifestPath

# Try to load required assemblies. If Add-Type by name fails, search common .NET folders.
try { Add-Type -AssemblyName System.Security.Cryptography.Xml -ErrorAction Stop } catch {
    $possible = @("C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\System.Security.Cryptography.Xml.dll", "C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\System.Security.Cryptography.Xml.dll")
    $found = $possible | Where-Object { Test-Path $_ }
    if ($found) { Add-Type -Path $found[0] } else { Write-Error "Cannot load System.Security.Cryptography.Xml assembly."; exit 1 }
}

$cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($PfxPath, $PfxPassword, [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::Exportable)

$signedXml = New-Object System.Security.Cryptography.Xml.SignedXml($xmlDoc)
# Set signing key: prefer GetRSAPrivateKey(), fallback to PrivateKey for .NET Framework
if ($cert -and ($cert.PSObject.Methods.Name -contains 'GetRSAPrivateKey')) {
    $rsa = $cert.GetRSAPrivateKey()
    $signedXml.SigningKey = $rsa
} else {
    $signedXml.SigningKey = $cert.PrivateKey
}

$ref = New-Object System.Security.Cryptography.Xml.Reference
$ref.Uri = ""
$envTransform = New-Object System.Security.Cryptography.Xml.XmlDsigEnvelopedSignatureTransform
$ref.AddTransform($envTransform)
$c14n = New-Object System.Security.Cryptography.Xml.XmlDsigC14NTransform
$ref.AddTransform($c14n)

$signedXml.AddReference($ref)

$keyInfo = New-Object System.Security.Cryptography.Xml.KeyInfo
$x509 = New-Object System.Security.Cryptography.Xml.KeyInfoX509Data($cert)
$keyInfo.AddClause($x509)
$signedXml.KeyInfo = $keyInfo

$signedXml.ComputeSignature()
$xmlSig = $signedXml.GetXml()
$xmlDoc.DocumentElement.AppendChild($xmlDoc.ImportNode($xmlSig, $true)) | Out-Null

Copy-Item $ManifestPath (${ManifestPath} + '.bak') -Force
$xmlDoc.Save($ManifestPath)
Write-Host "Signed manifest saved to $ManifestPath (backup at $ManifestPath.bak)"
