Param(
    [string]$TargetDir = "$env:LOCALAPPDATA\WPSAddins\AI_Pilot_for_WPS_Word",
    [switch]$Force
)

Write-Host "Uninstall target: $TargetDir"

try {
    # Remove matching certificates from CurrentUser stores
    $matches = Get-ChildItem Cert:\CurrentUser\Root | Where-Object { $_.Subject -like '*AI Pilot for WPS Word*' }
    foreach ($c in $matches) { Remove-Item -Path ("Cert:\CurrentUser\Root\" + $c.Thumbprint) -Force -ErrorAction SilentlyContinue }

    $matches2 = Get-ChildItem Cert:\CurrentUser\My | Where-Object { $_.Subject -like '*AI Pilot for WPS Word*' }
    foreach ($c in $matches2) { Remove-Item -Path ("Cert:\CurrentUser\My\" + $c.Thumbprint) -Force -ErrorAction SilentlyContinue }

    Write-Host "Related certificates removed from current user stores (if any)"
} catch {
    Write-Host "Error removing certificates: $_" -ForegroundColor Yellow
}

if (Test-Path $TargetDir) {
    Remove-Item -Path $TargetDir -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Removed directory: $TargetDir"
} else { Write-Host "Install directory not found: $TargetDir" }

Write-Host "Uninstall complete."
