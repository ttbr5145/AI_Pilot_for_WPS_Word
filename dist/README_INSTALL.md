# 安装说明（给不太会弄电脑的朋友）

1. 把收到的整个文件夹（例如 `wps-gift`）解压到桌面或任意位置。

2. 双击 `install.ps1` 可能会被系统阻止，请按下面任一方式运行：

   - 推荐（简单）：以管理员身份打开 PowerShell，然后运行：

     ```powershell
     PowerShell -ExecutionPolicy Bypass -File .\install.ps1
     ```

   - 如果不愿使用管理员权限：右键 `install.ps1` → 用 PowerShell 运行；或在资源管理器地址栏输入

     ```powershell
     powershell -ExecutionPolicy Bypass -File .\install.ps1
     ```

3. 安装脚本会自动完成三件事：
   - 把扩展文件复制到 `%LocalAppData%\WPSAddins\AI_Pilot_for_WPS_Word`（默认路径）；
   - 在当前用户的「受信任根证书」中导入自签名证书，避免 WPS 弹安全提示；
   - 打开包含 `manifest.xml` 的文件夹并选中它，方便下一步加载。

4. 打开 WPS → 工具 → 加载项 → XML 扩展包，选择上一步显示的 `manifest.xml` 加载即可。

5. 功能区出现 `AI Pilot` 选项卡后，点「AI 助理」打开侧边栏，点右上角 ⚙ 填入你自己的 ChatAnywhere API Key（本仓库不内置 Key）。

6. 卸载：双击 `uninstall.ps1`，或以同样方式运行：

   ```powershell
   PowerShell -ExecutionPolicy Bypass -File .\uninstall.ps1
   ```

注意：

- 自签名证书仅适合开发与小范围分发。若要公开发布或大规模分发，请购买受信任的代码签名证书并重新签名 `manifest.xml`。
- 如果安装过程中出现报错或弹窗，把提示截图发给我，我帮你诊断。
