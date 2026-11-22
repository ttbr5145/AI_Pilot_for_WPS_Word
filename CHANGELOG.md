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
- 移除 `js/ai-config.js` 中硬编码的示例 API Key，改为留空并在侧边栏设置中填写；历史上暴露过的 Key 请自行作废。
- 新增 `LICENSE`（MIT）、`.gitignore`，重写本文件与 README。

### 已知问题
- `dist/manifest.xml` 的 `SourceLocation` 指向 `http://localhost:3890`，与开发端口 `3889` 不一致，直接加载 dist 包可能显示空白侧边栏，需按实际部署地址修改。
- 仓库历史上提交过示例 API Key 与自签名证书私钥（`temp.pfx`），请勿沿用，正式发布前应替换为自己的凭据。
- v1.0.0 的发布附件为修复前构建，其中仍含早期示例 Key，建议使用源码自行构建，或在下个版本重建附件。
