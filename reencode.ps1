$files = @(
    'dist\\install.ps1',
    'dist\\uninstall.ps1',
    'dist\\README_INSTALL.md'
)

foreach ($rel in $files) {
    $path = Join-Path $PSScriptRoot $rel
    if (Test-Path $path) {
        $content = Get-Content -Raw -Path $path
        $enc = New-Object System.Text.UTF8Encoding $true
        [System.IO.File]::WriteAllText($path, $content, $enc)
        Write-Host "Re-encoded: $path"
    } else {
        Write-Host "Not found: $path"
    }
}
