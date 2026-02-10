; NSIS installer for AI Pilot for WPS Word
Name "AI Pilot for WPS Word"
OutFile "wps-gift-installer.exe"
InstallDir "$LOCALAPPDATA\WPSAddins\AI_Pilot_for_WPS_Word"
RequestExecutionLevel user

Page directory
Page instfiles

Section "Install"
  SetOutPath "$INSTDIR"
  File /r "dist\\*"
  ; write uninstaller
  WriteUninstaller "$INSTDIR\\Uninstall.exe"
  ; register uninstall information
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\AI Pilot for WPS Word" "DisplayName" "AI Pilot for WPS Word"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\AI Pilot for WPS Word" "UninstallString" "$INSTDIR\\Uninstall.exe"

  ; run the PowerShell install script (bypass execution policy)
  ExecWait 'PowerShell -NoProfile -ExecutionPolicy Bypass -File "$INSTDIR\\install.ps1"'
SectionEnd

Section "Uninstall"
  ; run uninstall script if present
  ExecWait 'PowerShell -NoProfile -ExecutionPolicy Bypass -File "$INSTDIR\\uninstall.ps1"'
  RMDir /r "$INSTDIR"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\AI Pilot for WPS Word"
SectionEnd
