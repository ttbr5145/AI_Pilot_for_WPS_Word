# 安装说明（给不会电脑的朋友）

1. 把收到的整个文件夹（例如 `wps-gift`）解压到桌面或任意位置。
2. 双击 `install.ps1` 可能会被阻止，请按下面任一方式运行：

   - 推荐（简单）：以管理员身份打开 PowerShell，然后运行：

     ```powershell
     PowerShell -ExecutionPolicy Bypass -File .\install.ps1
     ```

   - 如果不愿使用管理员权限，直接右键 `install.ps1` -> 用 PowerShell 运行（或在资源管理器地址栏输入 `powershell -ExecutionPolicy Bypass -File .\install.ps1`）。

3. 安装脚本会完成：
   - 将扩展文件复制到 `%LocalAppData%\WPSAddins\AI_Pilot_for_WPS_Word`（默认）；
   - 在“当前用户”的受信任根证书中自动添加自签名证书，以避免 WPS 的安全提示；
   - 打开包含 `manifest.xml` 的文件夹并选中它，方便后续在 WPS 中加载。

4. 打开 WPS -> 工具 -> 加载项 -> XML 扩展包，选择上一步中显示的 `manifest.xml` 并加载即可使用插件。

5. 如果要卸载，请双击 `uninstall.ps1`（或以同样方式运行 PowerShell 命令）：

   ```powershell
   PowerShell -ExecutionPolicy Bypass -File .\uninstall.ps1
   ```

注意：
- 自签名证书仅用于开发和小范围分发。如果你打算公开发布或大规模分发，请购买受信任的代码签名证书并签名 `manifest.xml`。
- 如果安装过程中出现提示，请把提示截图发给我，我帮你诊断。
