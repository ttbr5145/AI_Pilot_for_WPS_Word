# 更新日志

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## v1.0.0 — 2026-02-10

首个可用版本（MVP）。

### 新增
- AI 对话侧边栏：接入 ChatAnywhere（OpenAI 兼容）接口，支持模型切换与温度、最大 token 配置。
- 五套内置系统提示词（默认 / 写作 / 编辑 / 翻译 / 摘要）+ 自定义提示词。
- AI 回复支持「保存到素材库」「插入文档」两个动作。
- 素材库侧边栏：新增、编辑、删除、复制、插入文档，数据持久化到 `localStorage` 与 `PluginStorage`。
- 功能区（Ribbon）两个入口按钮：AI 助理、素材库，支持侧边栏显示/隐藏切换。
- 安装方案：`install.ps1` / `uninstall.ps1` 脚本，配套 NSIS 安装包 `wps-gift-installer.exe`。
- 清单签名脚本 `sign-manifest.ps1`，避免 WPS 加载时的安全提示。

### 变更
- 移除 `js/ai-config.js` 中硬编码的示例 API Key，改为留空并在侧边栏设置中填写。
- 移除自签名证书私钥 `temp.pfx`，构建脚本改为运行时输入密码，不再硬编码 `P@ssw0rd!`。
- `node_modules/` 退出版本控制（保留 `package-lock.json`），仓库体积从 ~21 MB 降至源码级。
- 修正 `manifest.xml` / `dist/manifest.xml` 的 `SourceLocation` 端口（3890 → 3889），与 `npm run dev` 一致；同时修复 `dist/manifest.xml` 中被重复编码的中文描述。
- 新增 `LICENSE`（MIT）、`.gitignore`、本文件，重写 README。

### 已知问题
- `dist/manifest.xml` 在本地重新签名前仍指向开发地址，正式分发需改为部署地址并重新签名。
- v1.0.0 的 Release 附件为清理前的构建产物，其压缩包内 `js/ai-config.js` 仍含早期示例 Key、`manifest.xml` 仍为旧端口，建议使用源码重新构建或在下个版本重建附件。
- 仓库历史中仍存在已作废的示例 Key 与证书私钥，不再随当前版本分发。
